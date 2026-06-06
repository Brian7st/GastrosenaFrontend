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
import { catchError, of, Observable, forkJoin } from 'rxjs';

export interface ItemCarrito {
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  categoria: string;
  observaciones?: string;
}

export interface ProductoMenu {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  available: number;
  sold: number;
  discount?: string;
  image: string;
  category: string;
  subcategory?: string;
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
  private authService = inject(AuthService);

  private _mesas = signal<Mesa[]>([]);
  private _mesasCargando = signal<boolean>(false);
  private _mesasError = signal<string | null>(null);
  private _ordenesHistorial = signal<PedidoCarrito[]>([]);
  private _pedidoActivo = signal<PedidoCarrito | null>(null);

  private _turnoCaja = signal<SesionCajaResponse | null>(null);
  private _pedidosParaCobro = signal<PedidoResumenResponse[]>([]);
  private _historialFacturas = signal<PedidoResumenResponse[]>([]);

  private _productosMenu = signal<ProductoMenu[]>([
    { id: '1', name: 'Coffee Latte', price: 21.20, originalPrice: 26.20, available: 72, sold: 14, discount: '20% OFF', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80', category: 'bebidas', subcategory: 'calientes' },
    { id: '2', name: 'Bolognese Spaghetti', price: 21.20, available: 8, sold: 32, image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=300&q=80', category: 'plato_fuerte' },
    { id: '3', name: 'Thanos Burger', price: 21.20, available: 12, sold: 73, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80', category: 'plato_fuerte' },
    { id: '4', name: 'Chamomile Tea', price: 21.20, available: 24, sold: 6, image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220cad1?w=300&q=80', category: 'bebidas', subcategory: 'calientes' },
    { id: '5', name: 'Neck Burner (Alitas)', price: 21.20, originalPrice: 26.20, available: 5, sold: 12, discount: '10% OFF', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80', category: 'entrada' },
    { id: '6', name: 'Black Tea', price: 21.20, available: 21, sold: 4, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=300&q=80', category: 'bebidas', subcategory: 'frias' },
    { id: '7', name: 'Otak Udang', price: 21.20, available: 3, sold: 21, discount: '20% OFF', image: 'https://images.unsplash.com/photo-1599487405270-891961f00880?w=300&q=80', category: 'entrada' },
    { id: '8', name: 'Mie Sedap', price: 21.20, available: 2, sold: 34, image: 'https://images.unsplash.com/photo-1612929633738-8fe01f72810c?w=300&q=80', category: 'plato_fuerte' },
    { id: '9', name: 'Pastel de Chocolate', price: 15.00, available: 10, sold: 25, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80', category: 'postre' },
    { id: '10', name: 'Margarita Clásica', price: 30.00, available: 50, sold: 100, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&q=80', category: 'bebidas', subcategory: 'con_alcohol' },
    { id: '11', name: 'Jugo Natural', price: 10.00, available: 30, sold: 50, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&q=80', category: 'bebidas', subcategory: 'sin_alcohol' }
  ]);

  readonly mesas = this._mesas.asReadonly();
  readonly mesasCargando = this._mesasCargando.asReadonly();
  readonly mesasError = this._mesasError.asReadonly();
  readonly ordenesHistorial = this._ordenesHistorial.asReadonly();
  readonly pedidoActivo = this._pedidoActivo.asReadonly();
  readonly turnoCaja = this._turnoCaja.asReadonly();
  readonly isCajaAbierta = computed(() => this._turnoCaja()?.estado === 'ABIERTA');
  readonly pedidosParaCobro = this._pedidosParaCobro.asReadonly();
  readonly historialFacturas = this._historialFacturas.asReadonly();
  readonly productosMenu = this._productosMenu.asReadonly();

  readonly stats = computed<RestauranteStats>(() => {
    const mesasActivas = this._mesas().filter(m => m.activo);
    const totalMesas = mesasActivas.length;
    const mesasOcupadas = mesasActivas.filter(m => m.estado !== 'LIBRE').length;
    const porcentajeOcupacion = totalMesas > 0
      ? Math.round((mesasOcupadas / totalMesas) * 100)
      : 0;

    const pedidosPendientes = 0;

    return { totalMesas, mesasOcupadas, porcentajeOcupacion, pedidosPendientes };
  });

  readonly cajaStats = computed<CajaStats>(() => {
    const porCobrar = this._pedidosParaCobro();
    const facturas = this._historialFacturas();
    return {
      pedidosListos: porCobrar.length,
      mesasPorPagar: porCobrar.length,
      facturasHoy: facturas.length,
      totalFacturado: facturas.reduce((sum, f) => sum + (f.subtotal || 0), 0)
    };
  });

  constructor() {
    this.cargarMesas();
    this.cargarEstadoLocalNoMesas();
  }

  cargarMesas(): void {
    this._mesasCargando.set(true);
    this._mesasError.set(null);

    forkJoin([
      this.restauranteService.obtenerMesas(),
      this.restauranteService.obtenerMesasInactivas()
    ]).subscribe({
      next: ([activas, inactivas]) => {
        this._mesas.set([...activas, ...inactivas]);
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
    const turnoGuardado = localStorage.getItem('gastro_turno_caja');

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
    localStorage.setItem('gastro_ordenes', JSON.stringify(this._ordenesHistorial()));
    localStorage.setItem('gastro_turno_caja', JSON.stringify(this._turnoCaja()));
  }

  agregarMesa(nombre: string, capacidad: number, zona: string): Observable<boolean | string> {
    const request: MesaCreateRequest = { nombre, capacidad, zona: zona || null };
    return new Observable(observer => {
      this.restauranteService.crearMesa(request).subscribe({
        next: (mesaNueva) => {
          this._mesas.update(lista => [...lista, mesaNueva]);
          observer.next(true);
          observer.complete();
        },
        error: (err) => {
          console.error('[RestauranteFacade] Error al crear mesa:', err);
          const msg = err.error?.mensaje || err.error?.message || 'Error desconocido al crear mesa.';
          observer.next(msg);
          observer.complete();
        }
      });
    });
  }

  abrirMesa(mesaId: string, _comensal: string, cantidadComensales: number): void {
    this.iniciarCarrito(mesaId, cantidadComensales);
  }

  eliminarMesa(mesaId: string): Observable<boolean | string> {
    return this.cambiarEstadoActivoMesa(mesaId, false);
  }

  cambiarEstadoActivoMesa(mesaId: string, activo: boolean): Observable<boolean | string> {
    return new Observable(observer => {
      this.restauranteService.cambiarEstadoActivo(mesaId, activo).subscribe({
        next: (mesaActualizada) => {
          this._mesas.update(lista =>
            lista.map(m => m.id === mesaActualizada.id 
              ? { ...mesaActualizada, observaciones: m.observaciones } 
              : m
            )
          );
          observer.next(true);
          observer.complete();
        },
        error: (err) => {
          console.error(
            `[RestauranteFacade] Error al ${activo ? 'activar' : 'desactivar'} mesa ${mesaId}:`,
            err
          );
          const msg = err.error?.mensaje || err.error?.message || `Error desconocido al ${activo ? 'activar' : 'desactivar'} mesa.`;
          observer.next(msg);
          observer.complete();
        }
      });
    });
  }

  liberarMesa(mesaId: string): Observable<boolean | string> {
    return this.actualizarEstado(mesaId, 'LIBRE');
  }

  actualizarNotas(_mesaId: string, _notas: string): void {
    console.warn('[RestauranteFacade] actualizarNotas() aún no está conectado al backend.');
  }

  editarMesa(mesaId: string, cambios: MesaUpdateRequest): Observable<boolean | string> {
    return new Observable(observer => {
      this.restauranteService.editarMesa(mesaId, cambios).subscribe({
        next: (mesaActualizada) => {
          this._mesas.update(lista =>
            lista.map(m => m.id === mesaActualizada.id 
              ? { ...mesaActualizada, observaciones: cambios.observaciones || m.observaciones } 
              : m
            )
          );
          observer.next(true);
          observer.complete();
        },
        error: (err) => {
          console.error(`[RestauranteFacade] Error al editar mesa ${mesaId}:`, err);
          const msg = err.error?.mensaje || err.error?.message || 'Error desconocido al editar mesa.';
          observer.next(msg);
          observer.complete();
        }
      });
    });
  }

  /** @deprecated — sustituido por editarMesa(id, MesaUpdateRequest). */
  actualizarMesa(_mesa: Mesa): void {
    console.warn('[RestauranteFacade] Usa editarMesa(id, cambios) en su lugar.');
  }

  actualizarEstado(mesaId: string, nuevoEstado: EstadoMesa): Observable<boolean | string> {
    return new Observable(observer => {
      this.restauranteService.cambiarEstadoMesa(mesaId, nuevoEstado).subscribe({
        next: (mesaActualizada) => {
          this._mesas.update(lista =>
            lista.map(m => m.id === mesaActualizada.id ? mesaActualizada : m)
          );
          observer.next(true);
          observer.complete();
        },
        error: (err) => {
          console.error(
            `[RestauranteFacade] Error al cambiar estado de mesa ${mesaId} a ${nuevoEstado}:`,
            err
          );
          const msg = err.error?.mensaje || err.error?.message || 'Error desconocido al cambiar estado de la mesa.';
          observer.next(msg);
          observer.complete();
        }
      });
    });
  }

  seleccionarMesaParaPedido(mesaId: string): void {
    const mesa = this.mesas().find(m => m.id === mesaId);
    if (mesa && (mesa.estado === 'OCUPADA' || mesa.estado === 'POR_PAGAR')) {
      // Si la mesa está ocupada, no creamos un carrito vacío, sino que el componente debe llamar a cargarPedidoDeMesaOcupada
      return;
    }
    this.iniciarCarrito(mesaId, 1);
  }

  cargarPedidoDeMesaOcupada(mesaId: string): Observable<boolean> {
    return new Observable(observer => {
      this.restauranteService.pedidosPorMesa(mesaId).subscribe({
        next: (pedidos) => {
          // Filtrar el pedido activo (que no esté pagado ni cancelado)
          const pedidoActivo = pedidos.find(p => p.estado !== 'FACTURADO' && p.estado !== 'CANCELADO');
          
          if (!pedidoActivo) {
            console.error('[RestauranteFacade] No se encontró pedido activo para la mesa Ocupada.');
            observer.next(false);
            observer.complete();
            return;
          }

          this.restauranteService.obtenerPedidoPorId(pedidoActivo.id).subscribe({
            next: (pedidoFull) => {
              const pedidoParaCarrito: PedidoCarrito = {
                id: pedidoFull.id,
                mesaId: pedidoFull.mesaId,
                meseroId: pedidoFull.meseroId,
                numeroComensales: pedidoFull.numeroComensales,
                estado: pedidoFull.estado,
                fechaCreacion: pedidoFull.fechaCreacion,
                subtotal: pedidoFull.subtotal,
                detalles: pedidoFull.detalles.map(d => ({
                  productoId: d.productoId,
                  nombreProducto: d.nombreProducto,
                  cantidad: d.cantidad,
                  precioUnitario: d.precioUnitario,
                  categoria: 'COMIDA', // Valor por defecto visual
                  observaciones: d.observaciones || undefined
                }))
              };
              this._pedidoActivo.set(pedidoParaCarrito);
              observer.next(true);
              observer.complete();
            },
            error: (err) => {
              console.error('[RestauranteFacade] Error obteniendo detalle del pedido:', err);
              observer.next(false);
              observer.complete();
            }
          });
        },
        error: (err) => {
          console.error('[RestauranteFacade] Error obteniendo pedidos por mesa:', err);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  cancelarPedidoActivoEnBackend(motivo: string = ''): Observable<boolean> {
    const pedido = this.pedidoActivo();
    if (!pedido || pedido.estado === 'BORRADOR') {
      return of(false);
    }
    return new Observable(observer => {
      this.restauranteService.cancelarPedido(pedido.id, motivo).subscribe({
        next: () => {
          this.vaciarCarrito();
          this.cargarMesas(); // Recargar mesas para actualizar el mapa
          observer.next(true);
          observer.complete();
        },
        error: (err) => {
          console.error('[RestauranteFacade] Error al cancelar pedido en backend:', err);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  private iniciarCarrito(mesaId: string, numeroComensales: number): void {
    const usuarioId = this.authService.getUsuarioId();

    this._pedidoActivo.set({
      id: `LOCAL-${Date.now()}`,
      mesaId,
      meseroId: usuarioId,
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
    observaciones: string = '',
    cantidad: number = 1
  ) {
    this._pedidoActivo.update(pedido => {
      if (!pedido) return null;
      if (pedido.estado !== 'BORRADOR') return pedido;

      const detalles = [...pedido.detalles];
      const indexExistente = detalles.findIndex(d => d.productoId === productoId && d.observaciones === observaciones);

      if (indexExistente >= 0) {
        detalles[indexExistente] = {
          ...detalles[indexExistente],
          cantidad: detalles[indexExistente].cantidad + cantidad
        };
      } else {
        const nuevoItem: ItemCarrito = { productoId, nombreProducto, cantidad, precioUnitario, categoria, observaciones };
        detalles.push(nuevoItem);
      }

      const subtotal = detalles.reduce((sum, it) => sum + (it.precioUnitario * it.cantidad), 0);

      return { ...pedido, detalles, subtotal };
    });
  }

  actualizarCantidadProducto(index: number, delta: number) {
    this._pedidoActivo.update(pedido => {
      if (!pedido) return null;
      if (pedido.estado !== 'BORRADOR') return pedido;

      const detalles = [...pedido.detalles];
      detalles[index].cantidad += delta;

      if (detalles[index].cantidad <= 0) {
        detalles.splice(index, 1);
      }

      const subtotal = detalles.reduce((sum, it) => sum + (it.precioUnitario * it.cantidad), 0);
      return { ...pedido, detalles, subtotal };
    });
  }

  eliminarProductoDelPedido(index: number) {
    this._pedidoActivo.update(pedido => {
      if (!pedido) return null;
      if (pedido.estado !== 'BORRADOR') return pedido;

      const detalles = [...pedido.detalles];
      detalles.splice(index, 1);

      const subtotal = detalles.reduce((sum, it) => sum + (it.precioUnitario * it.cantidad), 0);
      return { ...pedido, detalles, subtotal };
    });
  }

  vaciarCarrito() {
    this._pedidoActivo.update(pedido => {
      if (!pedido) return null;
      return { ...pedido, detalles: [], subtotal: 0 };
    });
  }

  limpiarPedidoActivo() {
    this._pedidoActivo.set(null);
  }

  confirmarPedidoActivo(notas: string = ''): Observable<boolean> {
    const pedido = this._pedidoActivo();
    if (!pedido || pedido.detalles.length === 0) {
      alert('No puedes confirmar un pedido vacío');
      return of(false);
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

    return new Observable(observer => {
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
          
          this.cargarMesas(); // Importante para actualizar estado OCUPADA

          this.enviarPedidoACocina(pedidoResponse.id);
          observer.next(true);
          observer.complete();
        },
        error: (err) => {
          console.error('[RestauranteFacade] Error al crear pedido:', err);
          alert('Hubo un error de comunicación al crear el pedido.');
          observer.next(false);
          observer.complete();
        }
      });
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
      next: (pedidos) => this._pedidosParaCobro.set(pedidos),
      error: (err) => {
        console.error('[RestauranteFacade] Error al cargar pedidos para cobro:', err);
        this._pedidosParaCobro.set([]);
      }
    });
  }

  cargarHistorialFacturas() {
    this.restauranteService.pedidosPorEstado('FACTURADO').subscribe({
      next: (pedidos) => this._historialFacturas.set(pedidos),
      error: (err) => {
        console.error('[RestauranteFacade] Error al cargar historial de facturas:', err);
        this._historialFacturas.set([]);
      }
    });
  }

  facturarPedido(pedidoId: string, metodoPago: MetodoPago): void {
    const request: FacturarPedidoRequest = { pedidoId, metodoPago };
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
    this.facturarPedido(pedidoId, metodoPago);
  }
}
