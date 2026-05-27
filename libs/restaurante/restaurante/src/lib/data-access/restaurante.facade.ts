import { Injectable, signal, computed, inject } from '@angular/core';
import { Mesa, EstadoMesa, MesaCreateRequest, MesaUpdateRequest, RestauranteStats, PedidoResumenResponse, CajaStats, TurnoCaja } from '../models/restaurante.model';
import { Pedido, EstadoPedido } from '@restaurant/shared/models';
import { RestauranteService } from './restaurante.service';

@Injectable({ providedIn: 'root' })
export class RestauranteFacade {
  private restauranteService = inject(RestauranteService);

  // Estado privado con Signals
  private _mesas          = signal<Mesa[]>([]);
  private _mesasCargando  = signal<boolean>(false);
  private _mesasError     = signal<string | null>(null);
  private _ordenesHistorial = signal<Pedido[]>([]);
  private _pedidoActivo   = signal<Pedido | null>(null);

  // Estado de Caja
  private _turnoCaja          = signal<TurnoCaja | null>(null);
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
    if (turnoGuardado) {
      this._turnoCaja.set(JSON.parse(turnoGuardado));
    }
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
   * Al confirmar el acceso a la mesa se cambia su estado en el backend.
   * TODO: integrar con la creación del Pedido asociado (fase siguiente).
   */
  abrirMesa(mesaId: string, _comensal: string, _cantidadComensales: number): void {
    this.actualizarEstado(mesaId, 'OCUPADA');
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

  // --- Gestión de Pedido Activo (TODO: conectar al backend en fases siguientes) ---

  /**
   * TODO: Cargar el pedido activo desde GET /api/pedidos?mesaId={id}&estado=BORRADOR
   */
  seleccionarMesaParaPedido(_mesaId: string): void {
    // TODO: implementar llamada al backend
    console.warn('[RestauranteFacade] seleccionarMesaParaPedido() aún no está conectado al backend.');
  }

  agregarProductoAlPedido(productoId: string, nombre: string, precioUnit: number, observacion: string = '') {
    this._pedidoActivo.update(pedido => {
      if (!pedido) return null;

      const newItem = { productoId, nombre, cantidad: 1, precioUnit, observacion };
      const items   = [...pedido.items, newItem];
      const total   = items.reduce((sum, item) => sum + (item.precioUnit * item.cantidad), 0);

      return { ...pedido, items, total };
    });
  }

  actualizarCantidadProducto(index: number, delta: number) {
    this._pedidoActivo.update(pedido => {
      if (!pedido) return null;

      const items = [...pedido.items];
      items[index].cantidad += delta;

      if (items[index].cantidad <= 0) {
        items.splice(index, 1);
      }

      const total = items.reduce((sum, item) => sum + (item.precioUnit * item.cantidad), 0);
      return { ...pedido, items, total };
    });
  }

  limpiarPedidoActivo() {
    this._pedidoActivo.set(null);
  }

  /**
   * TODO: Conectar a PATCH /api/pedidos/{id}/confirmar
   */
  confirmarPedidoActivo(): void {
    const pedido = this._pedidoActivo();
    if (!pedido) return;

    // TODO: llamar al backend para confirmar el pedido y que este cambie el estado
    // de la mesa a OCUPADA. Por ahora solo actualizamos el historial local.
    const pedidoConfirmado = { ...pedido, estado: EstadoPedido.PREPARACION };
    this._ordenesHistorial.update(historial => [pedidoConfirmado, ...historial]);
    this.limpiarPedidoActivo();
    this.guardarEstadoLocal();
  }

  // --- Módulo de Caja (Facturación y Pagos) ---

  abrirCaja(baseInicial: number, responsable: string) {
    const nuevoTurno: TurnoCaja = {
      id: `T-${Date.now()}`,
      estado: 'ABIERTA',
      baseInicial,
      responsable,
      fechaApertura: new Date()
    };
    this._turnoCaja.set(nuevoTurno);
    this.guardarEstadoLocal();
  }

  cerrarCaja() {
    this._turnoCaja.update(turno => {
      if (!turno) return null;
      return { ...turno, estado: 'CERRADA', fechaCierre: new Date() };
    });
    this.guardarEstadoLocal();
  }

  cargarPedidosParaCobro() {
    const mockPedidos: PedidoResumenResponse[] = [
      { id: 'P-001', nombreMesa: 'Mesa 1', meseroId: 'Juan', numeroComensales: 2, estado: 'ENTREGADO', subtotal: 45000,  fechaCreacion: new Date().toISOString() },
      { id: 'P-002', nombreMesa: 'Mesa 4', meseroId: 'Ana',  numeroComensales: 4, estado: 'ENTREGADO', subtotal: 120500, fechaCreacion: new Date().toISOString() }
    ];

    this.restauranteService.getPedidosPorEstado('ENTREGADO').subscribe({
      next:  (pedidos) => this._pedidosParaCobro.set(pedidos.length ? pedidos : mockPedidos),
      error: (err) => {
        console.error('Usando datos mockeados (error de API)', err);
        this._pedidosParaCobro.set(mockPedidos);
      }
    });
  }

  cargarHistorialFacturas() {
    const mockFacturas: PedidoResumenResponse[] = [
      { id: 'F-100', nombreMesa: 'Mesa 2', meseroId: 'Juan',   numeroComensales: 1, estado: 'FACTURADO', subtotal: 25000, fechaCreacion: new Date().toISOString() },
      { id: 'F-101', nombreMesa: 'Mesa 5', meseroId: 'Carlos', numeroComensales: 3, estado: 'FACTURADO', subtotal: 85000, fechaCreacion: new Date().toISOString() },
      { id: 'F-102', nombreMesa: 'Mesa 7', meseroId: 'Ana',    numeroComensales: 2, estado: 'FACTURADO', subtotal: 55000, fechaCreacion: new Date().toISOString() }
    ];

    this.restauranteService.getPedidosPorEstado('FACTURADO').subscribe({
      next:  (pedidos) => this._historialFacturas.set(pedidos.length ? pedidos : mockFacturas),
      error: (err) => {
        console.error('Usando facturas mockeadas', err);
        this._historialFacturas.set(mockFacturas);
      }
    });
  }

  procesarPagoFinal(pedidoId: string, metodo: string) {
    const pedidoPagado = this._pedidosParaCobro().find(p => p.id === pedidoId);
    if (pedidoPagado) {
      this._pedidosParaCobro.update(lista  => lista.filter(p => p.id !== pedidoId));
      this._historialFacturas.update(lista => [{ ...pedidoPagado, estado: 'FACTURADO' }, ...lista]);
    }

    this.restauranteService.registrarPago(pedidoId, metodo).subscribe({
      next:  () => console.log('Pago registrado en backend'),
      error: (err) => console.error('Error registrando pago en API', err)
    });
  }
}
