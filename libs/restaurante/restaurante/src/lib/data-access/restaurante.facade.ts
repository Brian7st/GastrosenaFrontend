import { Injectable, signal, computed, inject } from '@angular/core';
import {
  Mesa, EstadoMesa, MesaCreateRequest, MesaUpdateRequest,
  RestauranteStats, PedidoResumenResponse, CajaStats,
  EstadoPedido, PedidoResponse, PedidoCreateRequest,
  SesionCajaResponse, AbrirSesionRequest, CerrarSesionRequest,
  FacturarPedidoRequest, MetodoPago
} from '../models/restaurante.model';
import { RestauranteService } from './restaurante.service';
import { catchError, of } from 'rxjs';

export interface ItemCarrito {
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  categoria: string;
  observaciones?: string;
}

export interface PedidoCarrito {
  id: string;
  mesaId: string;
  meseroId: string;
  numeroComensales: number;
  estado: EstadoPedido;
  fechaCreacion: string;
  detalles: ItemCarrito[];
  subtotal: number;
}

@Injectable({ providedIn: 'root' })
export class RestauranteFacade {
  private restauranteService = inject(RestauranteService);

  private _mesas          = signal<Mesa[]>([]);
  private _mesasCargando  = signal<boolean>(false);
  private _mesasError     = signal<string | null>(null);
  private _ordenesHistorial = signal<PedidoCarrito[]>([]);
  private _pedidoActivo   = signal<PedidoCarrito | null>(null);

  private _turnoCaja          = signal<SesionCajaResponse | null>(null);
  private _pedidosParaCobro   = signal<PedidoResumenResponse[]>([]);
  private _historialFacturas  = signal<PedidoResumenResponse[]>([]);

  readonly mesas            = this._mesas.asReadonly();
  readonly mesasCargando    = this._mesasCargando.asReadonly();
  readonly mesasError       = this._mesasError.asReadonly();
  readonly ordenesHistorial = this._ordenesHistorial.asReadonly();
  readonly pedidoActivo     = this._pedidoActivo.asReadonly();
  readonly turnoCaja        = this._turnoCaja.asReadonly();
  readonly isCajaAbierta    = computed(() => this._turnoCaja()?.estado === 'ABIERTA');
  readonly pedidosParaCobro = this._pedidosParaCobro.asReadonly();
  readonly historialFacturas = this._historialFacturas.asReadonly();

  readonly stats = computed<RestauranteStats>(() => {
    const mesasActivas  = this._mesas().filter(m => m.activo);
    const totalMesas    = mesasActivas.length;
    const mesasOcupadas = mesasActivas.filter(m => m.estado !== 'LIBRE').length;
    const porcentajeOcupacion = totalMesas > 0
      ? Math.round((mesasOcupadas / totalMesas) * 100)
      : 0;

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

  private cargarEstadoLocalNoMesas(): void {
    const ordenesGuardadas = localStorage.getItem('gastro_ordenes');
    const turnoGuardado    = localStorage.getItem('gastro_turno_caja');

    if (ordenesGuardadas) {
      this._ordenesHistorial.set(JSON.parse(ordenesGuardadas));
    }

    this.restauranteService.obtenerSesionActiva().pipe(
      catchError((err) => {
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
  }

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

  abrirMesa(mesaId: string, _comensal: string, cantidadComensales: number): void {
    this.iniciarCarrito(mesaId, cantidadComensales);
  }

  eliminarMesa(mesaId: string): void {
    this.cambiarEstadoActivoMesa(mesaId, false);
  }

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

  liberarMesa(mesaId: string): void {
    this.actualizarEstado(mesaId, 'LIBRE');
  }

  actualizarNotas(_mesaId: string, _notas: string): void {
    console.warn('[RestauranteFacade] actualizarNotas() aún no está conectado al backend.');
  }

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

  /** @deprecated — sustituido por editarMesa(id, MesaUpdateRequest). */
  actualizarMesa(_mesa: Mesa): void {
    console.warn('[RestauranteFacade] Usa editarMesa(id, cambios) en su lugar.');
  }

  actualizarEstado(mesaId: string, nuevoEstado: EstadoMesa): void {
    // Actualización optimista para reactividad instantánea en la UI
    this._mesas.update(lista =>
      lista.map(m => m.id === mesaId ? { ...m, estado: nuevoEstado } : m)
    );

    this.restauranteService.cambiarEstadoMesa(mesaId, nuevoEstado).subscribe({
      next: (mesaActualizada) => {
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

  seleccionarMesaParaPedido(mesaId: string): void {
    this.iniciarCarrito(mesaId, 1);
  }

  private iniciarCarrito(mesaId: string, numeroComensales: number): void {
    this._pedidoActivo.set({
      id: `LOCAL-${Date.now()}`,
      mesaId,
      meseroId: '00000000-0000-0000-0000-000000000000',
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
        const pedidoConfirmado: PedidoCarrito = {
          id: pedidoResponse.id,
          mesaId: pedidoResponse.mesaId,
          meseroId: pedidoResponse.meseroId,
          numeroComensales: pedidoResponse.numeroComensales,
          estado: 'EN_PREPARACION',
          fechaCreacion: pedidoResponse.fechaCreacion,
          detalles: pedido.detalles,
          subtotal: pedidoResponse.subtotal
        };

        this._ordenesHistorial.update(historial => [pedidoConfirmado, ...historial]);
        this.limpiarPedidoActivo();
        this.guardarEstadoLocal();

        this.enviarPedidoACocina(pedidoResponse.id);
      },
      error: (err) => {
        console.error('[RestauranteFacade] Error al crear pedido:', err);
        alert('Hubo un error de comunicación al crear el pedido.');
      }
    });
  }

  enviarPedidoACocina(pedidoId: string): void {
    this.restauranteService.confirmarPedido(pedidoId).subscribe({
      next: (pedidoResponse) => {
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

  marcarPedidoComoEntregado(pedidoId: string): void {
    this.restauranteService.entregarPedido(pedidoId).subscribe({
      next: (pedidoResponse) => {
        this._ordenesHistorial.update(historial =>
          historial.map(p => p.id === pedidoId ? { ...p, estado: 'ENTREGADO' } : p)
        );
        
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

  facturarPedido(pedidoId: string, metodoPago: MetodoPago, propina: number = 0): void {
    const request: FacturarPedidoRequest = { pedidoId, metodoPago, propina };
    this.restauranteService.facturarPedido(request).subscribe({
      next: (factura) => {
        this._pedidosParaCobro.update(lista => lista.filter(p => p.id !== pedidoId));
        const pedidoOriginal = this._pedidosParaCobro().find(p => p.id === pedidoId);
        if (pedidoOriginal) {
          this._historialFacturas.update(lista => [{ ...pedidoOriginal, estado: 'FACTURADO' }, ...lista]);
        }
        this.cargarMesas();
      },
      error: (err) => {
        console.error(`[RestauranteFacade] Error al facturar pedido ${pedidoId}:`, err);
      }
    });
  }

  /** @deprecated */
  procesarPagoFinal(pedidoId: string, metodo: string) {
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
