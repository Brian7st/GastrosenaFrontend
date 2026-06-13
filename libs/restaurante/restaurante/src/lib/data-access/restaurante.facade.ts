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
import { catchError, of, Observable, forkJoin, switchMap } from 'rxjs';

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
  tiempoPreparacion?: number;
  temperatura?: string;
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
  private _errorGeneral = signal<string | null>(null);

  private _turnoCaja = signal<SesionCajaResponse | null>(null);
  private _pedidosParaCobro = signal<PedidoResumenResponse[]>([]);
  private _historialFacturas = signal<any[]>([]);

  private _productosMenu = signal<ProductoMenu[]>([]);
  private readonly _mostrarModalAccesoDenegado = signal<boolean>(false);

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
  readonly errorGeneral = computed(() => this._errorGeneral());
  readonly mostrarModalAccesoDenegado = computed(() => this._mostrarModalAccesoDenegado());

  readonly puedeAdministrarMesas = computed(() => {
    return this.authService.hasAnyRole(['ROLE_ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR', 'ROLE_INSTRUCTOR', 'INSTRUCTOR', 'ADMINISTRADOR_SISTEMA', 'ROLE_ADMINISTRADOR_SISTEMA', 'ADMIN', 'MESAS_AGREGAR']);
  });

  readonly nombreUsuario = computed(() => {
    return this.authService.getUsuarioNombre();
  });

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
    this.cargarMenu();
    this.cargarMesas();
    this.cargarEstadoLocalNoMesas();
  }

  abrirModalAccesoDenegado(): void {
    this._mostrarModalAccesoDenegado.set(true);
  }

  cerrarModalAccesoDenegado(): void {
    this._mostrarModalAccesoDenegado.set(false);
  }

  cargarMenu(): void {
    forkJoin({
      cocina: this.restauranteService.obtenerRecetas().pipe(catchError(() => of([]))),
      bar: this.restauranteService.obtenerRecetasBar().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ cocina, bar }) => {
        const todasLasRecetas = [...cocina, ...bar];
        const menuMapeado: ProductoMenu[] = todasLasRecetas.filter(r => r.activo !== false).map(r => {
          let cat = 'plato_fuerte';
          let subcat: string | undefined = undefined;
          const catNombre = (r.nombreCategoria || '').toLowerCase();
          
          if (catNombre.includes('bebida')) {
            cat = 'bebidas';
            if (catNombre.includes('caliente')) subcat = 'calientes';
            else if (catNombre.includes('fria') || catNombre.includes('fría')) subcat = 'frias';
            else if (catNombre.includes('sin alcohol')) subcat = 'sin_alcohol';
            else if (catNombre.includes('con alcohol') || catNombre.includes('licor')) subcat = 'con_alcohol';
          }
          else if (catNombre.includes('entrada')) cat = 'entrada';
          else if (catNombre.includes('postre')) cat = 'postre';

          return {
            id: r.idReceta,
            name: r.nombreReceta,
            price: r.precioUnitario,
            tiempoPreparacion: r.tiempoPreparacion,
            temperatura: r.temperatura,
            image: r.urlImagen || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80',
            category: cat,
            subcategory: subcat
          };
        });
        this._productosMenu.set(menuMapeado);
      },
      error: (err) => {
        console.error('[RestauranteFacade] Error fatal al cargar menú:', err);
      }
    });
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
    this.restauranteService.obtenerSesionActiva().pipe(
      catchError((err) => {
        if (err.status !== 404) {
          console.error('[RestauranteFacade] Error al cargar sesión activa:', err);
        }
        return of(null);
      })
    ).subscribe((sesion) => this._turnoCaja.set(sesion));
  }

  private procesarCargaPedidos(obs$: Observable<PedidoResumenResponse[]>): void {
    obs$.pipe(
      switchMap(pedidosResumen => {
        if (!pedidosResumen || pedidosResumen.length === 0) {
          return of([]);
        }
        const requests = pedidosResumen.map(p => this.restauranteService.obtenerPedidoPorId(p.id).pipe(
          catchError(err => {
            console.error(`[RestauranteFacade] Error al cargar detalles del pedido ${p.id}`, err);
            return of(null);
          })
        ));
        return forkJoin(requests);
      })
    ).subscribe({
      next: (pedidosFull) => {
        const validPedidos = pedidosFull.filter(p => p !== null);
        const pedidosMapeados: PedidoCarrito[] = validPedidos.map(p => ({
          id: p!.id,
          mesaId: p!.mesaId,
          meseroId: p!.meseroId,
          numeroComensales: p!.numeroComensales,
          estado: p!.estado,
          fechaCreacion: p!.fechaCreacion,
          subtotal: p!.subtotal,
          detalles: p!.detalles.map(d => {
            const productoCat = this._productosMenu().find(pm => pm.id === d.productoId)?.category || 'COMIDA';
            return {
              productoId: d.productoId,
              nombreProducto: d.nombreProducto,
              cantidad: d.cantidad,
              precioUnitario: d.precioUnitario,
              categoria: productoCat,
              observaciones: d.observaciones || undefined
            };
          })
        }));

        const ESTADO_PESO: Record<string, number> = {
          'LISTO_PARA_SERVIR': 1,
          'EN_PREPARACION': 2,
          'ENVIADO_COCINA': 3,
          'BORRADOR': 4,
          'ENTREGADO': 5,
          'FACTURADO': 6,
          'CANCELADO': 7
        };

        pedidosMapeados.sort((a, b) => {
          const pesoA = ESTADO_PESO[a.estado] || 99;
          const pesoB = ESTADO_PESO[b.estado] || 99;
          if (pesoA !== pesoB) {
            return pesoA - pesoB;
          }
          return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        });

        this._ordenesHistorial.set(pedidosMapeados);
      },
      error: (err) => {
        console.error('[RestauranteFacade] Error al cargar órdenes:', err);
      }
    });
  }

  cargarMisOrdenes(): void {
    this.procesarCargaPedidos(this.restauranteService.misPedidos());
  }

  cargarTodasLasOrdenes(): void {
    this.procesarCargaPedidos(this.restauranteService.listarTodosPedidos());
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
          const msg = err.error?.error || err.error?.mensaje || err.error?.message || 'Error desconocido al crear mesa.';
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
          const msg = err.error?.error || err.error?.mensaje || err.error?.message || `Error desconocido al ${activo ? 'activar' : 'desactivar'} mesa.`;
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
          const msg = err.error?.error || err.error?.mensaje || err.error?.message || 'Error desconocido al editar mesa.';
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
          const msg = err.error?.error || err.error?.mensaje || err.error?.message || 'Error desconocido al cambiar estado de la mesa.';
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
          const pedidoActivo = pedidos.find(p => p.estado !== EstadoPedido.FACTURADO && p.estado !== EstadoPedido.CANCELADO);

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
                detalles: pedidoFull.detalles.map(d => {
                  const prod = this._productosMenu().find(m => m.id === d.productoId || m.name === d.nombreProducto);
                  return {
                    productoId: d.productoId,
                    nombreProducto: d.nombreProducto,
                    cantidad: d.cantidad,
                    precioUnitario: d.precioUnitario,
                    categoria: prod ? prod.category : 'COMIDA', // Mapeo dinámico desde el catálogo
                    observaciones: d.observaciones || undefined
                  };
                })
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
    if (!pedido || pedido.estado === EstadoPedido.BORRADOR) {
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
      estado: EstadoPedido.BORRADOR,
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
      if (pedido.estado !== EstadoPedido.BORRADOR) return pedido;

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
      if (pedido.estado !== EstadoPedido.BORRADOR) return pedido;

      const detalles = [...pedido.detalles];
      detalles[index].cantidad += delta;

      if (detalles[index].cantidad <= 0) {
        detalles.splice(index, 1);
      }

      const subtotal = detalles.reduce((sum, it) => sum + (it.precioUnitario * it.cantidad), 0);
      return { ...pedido, detalles, subtotal };
    });
  }

  actualizarObservacionesProducto(index: number, observaciones: string) {
    this._pedidoActivo.update(pedido => {
      if (!pedido) return null;
      if (pedido.estado !== EstadoPedido.BORRADOR) return pedido;

      const detalles = [...pedido.detalles];
      detalles[index] = { ...detalles[index], observaciones };

      return { ...pedido, detalles };
    });
  }

  eliminarProductoDelPedido(index: number) {
    this._pedidoActivo.update(pedido => {
      if (!pedido) return null;
      if (pedido.estado !== EstadoPedido.BORRADOR) return pedido;

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
            estado: EstadoPedido.EN_PREPARACION,
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
          const msg = err.error?.error || err.error?.mensaje || err.error?.message || 'Hubo un error de comunicación al crear el pedido.';
          alert(msg);
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
          historial.map(p => p.id === pedidoId ? { ...p, estado: EstadoPedido.ENTREGADO } : p)
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
    this.restauranteService.pedidosPorEstado(EstadoPedido.ENTREGADO).subscribe({
      next: (pedidos) => this._pedidosParaCobro.set(pedidos),
      error: (err) => {
        console.error('[RestauranteFacade] Error al cargar pedidos para cobro:', err);
        this._pedidosParaCobro.set([]);
      }
    });
  }

  cargarHistorialFacturas() {
    const sesion = this._turnoCaja();
    if (!sesion || !sesion.id || sesion.estado === 'CERRADA') {
      this._historialFacturas.set([]);
      return;
    }

    this.restauranteService.obtenerFacturasDeSesion(sesion.id).subscribe({
      next: (facturas) => this._historialFacturas.set(facturas),
      error: (err) => {
        console.error('[RestauranteFacade] Error al cargar historial de facturas:', err);
        this._historialFacturas.set([]);
      }
    });
  }

  facturarPedido(pedidoId: string, metodoPago: MetodoPago, propina: number = 0): Observable<string | null> {
    const request: FacturarPedidoRequest = { pedidoId, metodoPago, propina };
    return new Observable(observer => {
      this.restauranteService.facturarPedido(request).subscribe({
        next: (factura) => {
          this._pedidosParaCobro.update(lista => lista.filter(p => p.id !== pedidoId));

          // Refrescar facturas del turno actual
          this.cargarHistorialFacturas();

          // El backend ya libera la mesa, solo recargamos
          this.cargarMesas();

          observer.next(factura.id);
          observer.complete();
        },
        error: (err) => {
          console.error(`[RestauranteFacade] Error al facturar pedido ${pedidoId}:`, err);
          observer.next(null);
          observer.complete();
        }
      });
    });
  }

  descargarFacturaPdf(facturaId: string, numeroFactura: string = 'Recibo'): void {
    this.restauranteService.descargarFacturaPdf(facturaId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Factura-${numeroFactura}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('[RestauranteFacade] Error descargando el PDF de la factura:', err);
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
    this.facturarPedido(pedidoId, metodoPago).subscribe();
  }
}
