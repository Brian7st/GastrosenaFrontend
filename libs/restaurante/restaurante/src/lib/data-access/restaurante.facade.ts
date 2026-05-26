import { Injectable, signal, computed, inject } from '@angular/core';
import {
  Mesa, EstadoMesa, MesaCreateRequest, MesaUpdateRequest,
  RestauranteStats, PedidoResumenResponse, CajaStats,
  EstadoPedido, PedidoResponse, PedidoCreateRequest,
  SesionCajaResponse, AbrirSesionRequest, CerrarSesionRequest,
  FacturarPedidoRequest, MetodoPago
} from '../models/restaurante.model';
import { RestauranteService } from './restaurante.service';
import { AuthService } from './auth.service';
import { catchError, of } from 'rxjs';

/**
 * Representa un ítem del carrito de pedidos en el frontend.
 * Campos alineados con DetallePedidoRequest + extras de UI (subtotal local).
 */
export interface ItemCarrito {
  productoId: string;
  nombreProducto: string;  // = DetallePedidoRequest.nombreProducto
  cantidad: number;
  precioUnitario: number;  // = DetallePedidoRequest.precioUnitario
  categoria: string;
  observaciones?: string;
}

/**
 * Pedido en construcción en el frontend (borrador local).
 * Se convierte en PedidoCreateRequest al confirmar.
 */
export interface PedidoCarrito {
  id: string;
  mesaId: string;          // obligatorio — @NotNull en backend
  meseroId: string;
  numeroComensales: number; // necesario para el POST
  estado: EstadoPedido;
  fechaCreacion: string;   // ISO-8601
  detalles: ItemCarrito[];
  subtotal: number;        // calculado en frontend (suma precioUnitario * cantidad)
}

@Injectable({ providedIn: 'root' })
export class RestauranteFacade {
  private restauranteService = inject(RestauranteService);
  private authService = inject(AuthService);

  // Estado privado con Signals
  private _mesas          = signal<Mesa[]>([]);
  private _mesasCargando  = signal<boolean>(false);
  private _mesasError     = signal<string | null>(null);
  private _ordenesHistorial = signal<PedidoCarrito[]>([]);
  private _pedidoActivo   = signal<PedidoCarrito | null>(null);

  // Estado de Caja
  private _turnoCaja          = signal<SesionCajaResponse | null>(null);
  private _pedidosParaCobro   = signal<PedidoResumenResponse[]>([]);
  private _historialFacturas  = signal<PedidoResumenResponse[]>([]);

  // Selectores públicos (Signals)
  readonly mesas            = this._mesas.asReadonly();
  readonly mesasCargando    = this._mesasCargando.asReadonly();
  readonly mesasError       = this._mesasError.asReadonly();
  readonly ordenesHistorial = this._ordenesHistorial.asReadonly();
  readonly pedidoActivo     = this._pedidoActivo.asReadonly();
  readonly turnoCaja        = this._turnoCaja.asReadonly();
  readonly isCajaAbierta    = computed(() => this._turnoCaja()?.estado === 'ABIERTA');
  readonly pedidosParaCobro = this._pedidosParaCobro.asReadonly();
  readonly historialFacturas = this._historialFacturas.asReadonly();

  // KPIs computados
  readonly stats = computed<RestauranteStats>(() => {
    // Mesa está activa cuando activo === true (campo del backend)
    const mesasActivas  = this._mesas().filter(m => m.activo);
    const totalMesas    = mesasActivas.length;
    const mesasOcupadas = mesasActivas.filter(m => m.estado !== 'LIBRE').length;
    const porcentajeOcupacion = totalMesas > 0
      ? Math.round((mesasOcupadas / totalMesas) * 100)
      : 0;

    // TODO: pedidosPendientes requiere cruzar con el API de pedidos (fase siguiente)
    const pedidosPendientes = 0;

    return { totalMesas, mesasOcupadas, porcentajeOcupacion, pedidosPendientes };
  });

  readonly cajaStats = computed<CajaStats>(() => {
    const porCobrar = this._pedidosParaCobro();
    const facturas  = this._historialFacturas();
    return {
      pedidosListos:   porCobrar.length,
      mesasPorPagar:   porCobrar.length,
      facturasHoy:     facturas.length,
      totalFacturado:  facturas.reduce((sum, f) => sum + (f.subtotal || 0), 0)
    };
  });

  constructor() {
    this.cargarMesas();
    this.cargarEstadoLocalNoMesas();
  }

  // --- Carga de Mesas (GET backend) ---

  /**
   * Llama a GET /api/mesas y actualiza el signal _mesas.
   * Los headers de seguridad los inyecta mockSecurityInterceptor automáticamente.
   */
  cargarMesas(): void {
    this._mesasCargando.set(true);
    this._mesasError.set(null);

    this.restauranteService.obtenerMesas().subscribe({
      next:  (mesas) => {
        this._mesas.set(mesas);
        this._mesasCargando.set(false);
      },
      error: (err) => {
        console.error('[RestauranteFacade] Error al cargar mesas:', err);
        this._mesasError.set('No se pudo conectar con el servidor. Verifica que el backend esté activo en localhost:8080.');
        this._mesas.set([]);
        this._mesasCargando.set(false);
      }
    });
  }

  // --- Estado local que NO viene del backend (turno de caja, historial de órdenes) ---

  private cargarEstadoLocalNoMesas(): void {
    const ordenesGuardadas = localStorage.getItem('gastro_ordenes');
    const turnoGuardado    = localStorage.getItem('gastro_turno_caja');

    if (ordenesGuardadas) {
      this._ordenesHistorial.set(JSON.parse(ordenesGuardadas));
    }

    this.restauranteService.obtenerSesionActiva().pipe(
      catchError((err) => {
        // 404 = no hay sesión activa, es normal
        if (err.status !== 404) {
          console.error('[RestauranteFacade] Error al cargar sesión activa:', err);
        }
        return of(null);
      })
    ).subscribe((sesion) => this._turnoCaja.set(sesion));
  }

  private guardarEstadoLocal(): void {
    localStorage.setItem('gastro_ordenes',     JSON.stringify(this._ordenesHistorial()));
    localStorage.setItem('gastro_turno_caja',  JSON.stringify(this._turnoCaja()));
    // Nota: las mesas ya no se persisten en localStorage; vienen del backend.
  }

  // --- Acciones de Mesas (TODO: conectar al backend en fases siguientes) ---

  /**
   * POST /api/mesas — crea la mesa en el backend y la añade al signal local.
   * El backend asigna estado=LIBRE y activo=true por defecto.
   */
  agregarMesa(nombre: string, capacidad: number, zona: string): void {
    const request: MesaCreateRequest = { nombre, capacidad, zona: zona || null };
    this.restauranteService.crearMesa(request).subscribe({
      next: (mesaNueva) => {
        this._mesas.update(lista => [...lista, mesaNueva]);
      },
      error: (err) => {
        console.error('[RestauranteFacade] Error al crear mesa:', err);
      }
    });
  }

  /**
   * Conectado a PATCH /api/mesas/{id}/estado?nuevoEstado=OCUPADA.
   * Al confirmar el acceso a la mesa se cambia su estado en el backend
   * y se inicializa el carrito (Pedido Activo) para esta mesa.
   */
  abrirMesa(mesaId: string, _comensal: string, cantidadComensales: number): void {
    // this.actualizarEstado(mesaId, 'OCUPADA'); // Comentado para evitar 422 al crear el pedido
    this.iniciarCarrito(mesaId, cantidadComensales);
  }

  /**
   * Mapea a PATCH /api/mesas/{id}/desactivar (el backend no expone DELETE).
   * La mesa queda con activo=false en lugar de eliminarse físicamente.
   */
  eliminarMesa(mesaId: string): void {
    this.cambiarEstadoActivoMesa(mesaId, false);
  }

  /**
   * PATCH /api/mesas/{id}/activar  |  /desactivar
   * Cambia la propiedad activo en el backend y actualiza el signal local
   * con el MesaResponse devuelto (que refleja el nuevo valor de activo).
   */
  cambiarEstadoActivoMesa(mesaId: string, activo: boolean): void {
    this.restauranteService.cambiarEstadoActivo(mesaId, activo).subscribe({
      next: (mesaActualizada) => {
        this._mesas.update(lista =>
          lista.map(m => m.id === mesaActualizada.id ? mesaActualizada : m)
        );
      },
      error: (err) => {
        console.error(
          `[RestauranteFacade] Error al ${activo ? 'activar' : 'desactivar'} mesa ${mesaId}:`,
          err
        );
      }
    });
  }

  /**
   * Conectado a PATCH /api/mesas/{id}/estado?nuevoEstado=LIBRE.
   */
  liberarMesa(mesaId: string): void {
    this.actualizarEstado(mesaId, 'LIBRE');
  }

  /**
   * TODO: El backend no tiene campo "notas" en Mesa. Evaluar si se agrega o si
   * las notas viven solo en el pedido.
   */
  actualizarNotas(_mesaId: string, _notas: string): void {
    // TODO: decidir si las notas son parte de Mesa o del Pedido en el backend
    console.warn('[RestauranteFacade] actualizarNotas() aún no está conectado al backend.');
  }

  /**
   * PUT /api/mesas/{id} — actualiza nombre, capacidad y/o zona.
   * Reemplaza la entrada correspondiente en el signal local al recibir
   * el MesaResponse actualizado del backend.
   */
  editarMesa(mesaId: string, cambios: MesaUpdateRequest): void {
    this.restauranteService.editarMesa(mesaId, cambios).subscribe({
      next: (mesaActualizada) => {
        this._mesas.update(lista =>
          lista.map(m => m.id === mesaActualizada.id ? mesaActualizada : m)
        );
      },
      error: (err) => {
        console.error(`[RestauranteFacade] Error al editar mesa ${mesaId}:`, err);
      }
    });
  }

  /**
   * @deprecated — sustituido por editarMesa(id, MesaUpdateRequest).
   * Mantenido temporalmente para no romper llamadas existentes.
   */
  actualizarMesa(_mesa: Mesa): void {
    console.warn('[RestauranteFacade] Usa editarMesa(id, cambios) en su lugar.');
  }

  /**
   * PATCH /api/mesas/{id}/estado?nuevoEstado=X
   *
   * Método central de cambio de estado. Llama al backend y, al recibir
   * el MesaResponse actualizado, reemplaza la mesa en el signal _mesas
   * para que la UI reaccione sin recargar toda la lista.
   *
   * Estrategia: "optimismo moderado" — esperamos la confirmación del backend
   * antes de actualizar el estado local (evita inconsistencias si hay error).
   */
  actualizarEstado(mesaId: string, nuevoEstado: EstadoMesa): void {
    this.restauranteService.cambiarEstadoMesa(mesaId, nuevoEstado).subscribe({
      next: (mesaActualizada) => {
        // Reemplaza solo la mesa modificada en el array del signal
        this._mesas.update(lista =>
          lista.map(m => m.id === mesaActualizada.id ? mesaActualizada : m)
        );
      },
      error: (err) => {
        console.error(
          `[RestauranteFacade] Error al cambiar estado de mesa ${mesaId} a ${nuevoEstado}:`,
          err
        );
      }
    });
  }

  // --- Gestión de Pedido Activo ---

  /**
   * Se invoca cuando el usuario accede a una mesa ya OCUPADA para ver o agregar
   * a su pedido actual. Por ahora (fase Pedidos), si no hay uno, lo inicializa.
   */
  seleccionarMesaParaPedido(mesaId: string): void {
    // TODO: A futuro debería hacer GET /api/pedidos/mesa/{mesaId} para cargar
    // el pedido activo real del backend. Por ahora iniciamos uno vacío.
    this.iniciarCarrito(mesaId, 1);
  }

  /**
   * Helper para instanciar el carrito temporal en memoria (_pedidoActivo)
   * que la UI usa para agregar productos. Evita el bloqueo de UI.
   */
  private iniciarCarrito(mesaId: string, numeroComensales: number): void {
    this._pedidoActivo.set({
      id: `LOCAL-${Date.now()}`, // UUID temporal
      mesaId,
      meseroId: this.authService.getUsuarioId(),
      numeroComensales: numeroComensales || 1,
      estado: 'BORRADOR',
      fechaCreacion: new Date().toISOString(),
      detalles: [],
      subtotal: 0
    });
  }

  agregarProductoAlPedido(
    productoId: string,
    nombreProducto: string,
    precioUnitario: number,
    categoria: string = 'COMIDA',
    observaciones: string = ''
  ) {
    this._pedidoActivo.update(pedido => {
      if (!pedido) return null;

      const nuevoItem: ItemCarrito = { productoId, nombreProducto, cantidad: 1, precioUnitario, categoria, observaciones };
      const detalles = [...pedido.detalles, nuevoItem];
      const subtotal = detalles.reduce((sum, it) => sum + (it.precioUnitario * it.cantidad), 0);

      return { ...pedido, detalles, subtotal };
    });
  }

  actualizarCantidadProducto(index: number, delta: number) {
    this._pedidoActivo.update(pedido => {
      if (!pedido) return null;

      const detalles = [...pedido.detalles];
      detalles[index].cantidad += delta;

      if (detalles[index].cantidad <= 0) {
        detalles.splice(index, 1);
      }

      const subtotal = detalles.reduce((sum, it) => sum + (it.precioUnitario * it.cantidad), 0);
      return { ...pedido, detalles, subtotal };
    });
  }

  limpiarPedidoActivo() {
    this._pedidoActivo.set(null);
  }

  /**
   * Envía el Pedido Activo al backend (POST /api/pedidos).
   */
  confirmarPedidoActivo(notas: string = ''): void {
    const pedido = this._pedidoActivo();
    if (!pedido) return;

    if (pedido.detalles.length === 0) {
      alert('No puedes confirmar un pedido vacío');
      return;
    }

    const request: PedidoCreateRequest = {
      mesaId: pedido.mesaId,
      numeroComensales: pedido.numeroComensales,
      notas: notas,
      // Solo mapeamos los campos requeridos por DetallePedidoRequest (excluye id y subtotalLinea)
      detalles: pedido.detalles.map(d => ({
        productoId: d.productoId,
        nombreProducto: d.nombreProducto,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        categoria: d.categoria,
        observaciones: d.observaciones
      }))
    };

    this.restauranteService.crearPedido(request).subscribe({
      next: (pedidoResponse) => {
        // En un flujo real, aquí llamaríamos a PATCH /api/pedidos/{id}/confirmar
        // para pasarlo de BORRADOR a ENVIADO_COCINA. 
        // Por compatibilidad con la UI actual, lo mapeamos localmente y limpiamos.
        const pedidoConfirmado: PedidoCarrito = {
          id: pedidoResponse.id,
          mesaId: pedidoResponse.mesaId,
          meseroId: pedidoResponse.meseroId,
          numeroComensales: pedidoResponse.numeroComensales,
          estado: 'EN_PREPARACION', // Mock estado UI
          fechaCreacion: pedidoResponse.fechaCreacion,
          detalles: pedido.detalles, // Mantenemos los de UI
          subtotal: pedidoResponse.subtotal
        };

        this._ordenesHistorial.update(historial => [pedidoConfirmado, ...historial]);
        this.limpiarPedidoActivo();
        this.guardarEstadoLocal();

        // Disparamos automáticamente el envío a cocina tras crearlo exitosamente
        this.enviarPedidoACocina(pedidoResponse.id);
      },
      error: (err) => {
        console.error('[RestauranteFacade] Error al crear pedido:', err);
        alert('Hubo un error de comunicación al crear el pedido.');
      }
    });
  }

  /**
   * PATCH /api/pedidos/{id}/confirmar
   * Cambia el estado del pedido a ENVIADO_COCINA y dispara eventos RabbitMQ en el backend.
   */
  enviarPedidoACocina(pedidoId: string): void {
    this.restauranteService.confirmarPedido(pedidoId).subscribe({
      next: (pedidoResponse) => {
        // Actualizamos el estado del pedido en el historial local a ENVIADO_COCINA
        this._ordenesHistorial.update(historial =>
          historial.map(p => p.id === pedidoId ? { ...p, estado: pedidoResponse.estado } : p)
        );
        this.guardarEstadoLocal();
      },
      error: (err) => {
        console.error(`[RestauranteFacade] Error al enviar a cocina el pedido ${pedidoId}:`, err);
      }
    });
  }

  /**
   * PATCH /api/pedidos/{id}/entregar
   * Cambia el estado del pedido a ENTREGADO. También cambia la mesa a POR_PAGAR.
   */
  marcarPedidoComoEntregado(pedidoId: string): void {
    this.restauranteService.entregarPedido(pedidoId).subscribe({
      next: (pedidoResponse) => {
        // Actualizamos el estado del pedido
        this._ordenesHistorial.update(historial =>
          historial.map(p => p.id === pedidoId ? { ...p, estado: 'ENTREGADO' } : p)
        );
        
        // Actualizamos el estado de la mesa a POR_PAGAR
        this._mesas.update(mesas =>
          mesas.map(m => m.id.toString() === pedidoResponse.mesaId ? { ...m, estado: 'POR_PAGAR' } : m)
        );
        
        this.guardarEstadoLocal();
      },
      error: (err) => {
        console.error(`[RestauranteFacade] Error al marcar como entregado el pedido ${pedidoId}:`, err);
      }
    });
  }

  // --- Módulo de Caja (Facturación y Pagos) ---

  abrirCaja(baseEfectivo: number) {
    const request: AbrirSesionRequest = { baseEfectivo };
    this.restauranteService.abrirSesion(request).subscribe({
      next: (sesion) => {
        this._turnoCaja.set(sesion);
      },
      error: (err) => console.error('[RestauranteFacade] Error al abrir caja:', err)
    });
  }

  cerrarCaja(efectivoReal: number) {
    const session = this._turnoCaja();
    if (!session) return;
    
    const request: CerrarSesionRequest = { efectivoReal };
    this.restauranteService.cerrarSesion(session.id, request).subscribe({
      next: (sesionCerrada) => {
        this._turnoCaja.set(sesionCerrada);
      },
      error: (err) => console.error('[RestauranteFacade] Error al cerrar caja:', err)
    });
  }

  cargarPedidosParaCobro() {
    this.restauranteService.pedidosPorEstado('ENTREGADO').subscribe({
      next:  (pedidos) => this._pedidosParaCobro.set(pedidos),
      error: (err) => {
        console.error('[RestauranteFacade] Error al cargar pedidos para cobro:', err);
        this._pedidosParaCobro.set([]);
      }
    });
  }

  cargarHistorialFacturas() {
    this.restauranteService.pedidosPorEstado('FACTURADO').subscribe({
      next:  (pedidos) => this._historialFacturas.set(pedidos),
      error: (err) => {
        console.error('[RestauranteFacade] Error al cargar historial de facturas:', err);
        this._historialFacturas.set([]);
      }
    });
  }

  /**
   * POST /api/caja/facturar
   * Envía el pago al backend. Al recibir éxito, recarga las mesas y los pedidos para cobro.
   */
  facturarPedido(pedidoId: string, metodoPago: MetodoPago, propina: number = 0): void {
    const request: FacturarPedidoRequest = { pedidoId, metodoPago, propina };
    this.restauranteService.facturarPedido(request).subscribe({
      next: (factura) => {
        // Quitamos el pedido de la lista local de "por cobrar"
        this._pedidosParaCobro.update(lista => lista.filter(p => p.id !== pedidoId));
        // Añadimos al historial con estado FACTURADO
        const pedidoOriginal = this._pedidosParaCobro().find(p => p.id === pedidoId);
        if (pedidoOriginal) {
          this._historialFacturas.update(lista => [{ ...pedidoOriginal, estado: 'FACTURADO' }, ...lista]);
        }
        // Recargamos mesas para que la mesa facturada vuelva a LIBRE
        this.cargarMesas();
      },
      error: (err) => {
        console.error(`[RestauranteFacade] Error al facturar pedido ${pedidoId}:`, err);
      }
    });
  }

  /**
   * @deprecated — Usa facturarPedido(pedidoId, metodoPago, propina) en su lugar.
   * Mantenido temporalmente para no romper llamadas existentes de la UI.
   */
  procesarPagoFinal(pedidoId: string, metodo: string) {
    // Mapeamos el string de la UI al tipo MetodoPago del backend
    const metodoMap: Record<string, MetodoPago> = {
      'Efectivo': 'EFECTIVO',
      'Tarjeta': 'TARJETA',
      'Transferencia': 'TRANSFERENCIA',
      'Cortesía': 'CORTESIA'
    };
    const metodoPago: MetodoPago = metodoMap[metodo] || 'EFECTIVO';
    this.facturarPedido(pedidoId, metodoPago, 0);
  }
}
