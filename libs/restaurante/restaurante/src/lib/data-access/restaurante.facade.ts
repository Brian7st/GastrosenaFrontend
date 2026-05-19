import { Injectable, signal, computed } from '@angular/core';
import { Mesa, RestauranteStats } from '../models/restaurante.model';
import { Pedido, EstadoPedido } from '@restaurant/shared/models';

@Injectable({ providedIn: 'root' })
export class RestauranteFacade {
  // Estado privado con Signals
  private _mesas = signal<Mesa[]>([]);
  private _ordenesHistorial = signal<Pedido[]>([]);
  private _pedidoActivo = signal<Pedido | null>(null);

  // Selectores públicos (Signals)
  readonly mesas = this._mesas.asReadonly();
  readonly ordenesHistorial = this._ordenesHistorial.asReadonly();
  readonly pedidoActivo = this._pedidoActivo.asReadonly();

  // KPIs computados
  readonly stats = computed<RestauranteStats>(() => {
    const mesasActivas = this._mesas().filter(m => m.isActive !== false);
    const totalMesas = mesasActivas.length;
    const mesasOcupadas = mesasActivas.filter(m => m.estado !== 'libre').length;
    const porcentajeOcupacion = totalMesas > 0 ? Math.round((mesasOcupadas / totalMesas) * 100) : 0;
    
    // Contar pedidos que no estén ENTREGADOS o CANCELADOS en las mesas activas
    const pedidosPendientes = mesasActivas.filter(m => 
      m.ordenActual && 
      m.ordenActual.estado !== EstadoPedido.ENTREGADO && 
      m.ordenActual.estado !== EstadoPedido.CANCELADO
    ).length;

    return {
      totalMesas,
      mesasOcupadas,
      porcentajeOcupacion,
      pedidosPendientes
    };
  });

  constructor() {
    this.cargarDatos();
  }

  // --- Acciones ---

  private cargarDatos() {
    const mesasGuardadas = localStorage.getItem('gastro_mesas');
    const ordenesGuardadas = localStorage.getItem('gastro_ordenes');
    
    if (mesasGuardadas) {
      this._mesas.set(JSON.parse(mesasGuardadas));
    }
    if (ordenesGuardadas) {
      this._ordenesHistorial.set(JSON.parse(ordenesGuardadas));
    }
  }

  private guardarDatos() {
    localStorage.setItem('gastro_mesas', JSON.stringify(this._mesas()));
    localStorage.setItem('gastro_ordenes', JSON.stringify(this._ordenesHistorial()));
  }

  agregarMesa(numero: number, asientos: number, zona: string, isActive: boolean) {
    const mesas = this._mesas();
    // Validar si el número ya existe, si sí, calcular el siguiente
    const existe = mesas.some(m => m.numero === numero);
    const finalNumero = (numero > 0 && !existe) ? numero : (mesas.length > 0 ? Math.max(...mesas.map(m => m.numero)) + 1 : 1);
    
    // Usamos timestamp como ID para que siempre sea único, o el numero final si preferimos
    const uniqueId = new Date().getTime(); 
    
    const nuevaMesa: Mesa = {
      id: uniqueId,
      numero: finalNumero,
      asientos,
      zona,
      isActive,
      estado: 'libre',
      comensal: '',
      cantidadComensales: undefined,
      ordenActual: null,
      notas: ''
    };

    this._mesas.set([...mesas, nuevaMesa]);
    this.guardarDatos();
  }

  abrirMesa(id: number, comensal: string, cantidadComensales: number) {
    this._mesas.update(mesas => mesas.map(m => {
      if (m.id === id) {
        // Crear orden inicial simulada
        const nuevaOrden: Pedido = {
          id: Math.random().toString(36).substring(7),
          numero: this._ordenesHistorial().length + 1,
          mesaId: m.id.toString(),
          meseroId: '1',
          estado: EstadoPedido.ESPERA,
          destino: 'COCINA',
          horaCreacion: new Date(),
          items: [],
          total: 0
        };
        this._ordenesHistorial.set([nuevaOrden, ...this._ordenesHistorial()]);
        return { ...m, estado: 'ocupada', comensal, cantidadComensales, ordenActual: nuevaOrden };
      }
      return m;
    }));
    this.guardarDatos();
  }

  eliminarMesa(id: number) {
    this._mesas.update(mesas => mesas.filter(m => m.id !== id));
    this.guardarDatos();
  }

  cambiarEstadoActivoMesa(id: number, isActive: boolean) {
    this._mesas.update(mesas => mesas.map(m => m.id === id ? { ...m, isActive } : m));
    this.guardarDatos();
  }

  liberarMesa(id: number) {
    this._mesas.update(mesas => mesas.map(m => {
      if (m.id === id) {
        return { ...m, estado: 'libre', comensal: '', cantidadComensales: undefined, ordenActual: null };
      }
      return m;
    }));
    this.guardarDatos();
  }

  actualizarNotas(id: number, notas: string) {
    this._mesas.update(mesas => mesas.map(m => m.id === id ? { ...m, notas } : m));
    this.guardarDatos();
  }

  actualizarMesa(mesa: Mesa) {
    this._mesas.update(mesas => mesas.map(m => m.id === mesa.id ? mesa : m));
    this.guardarDatos();
  }

  // --- Gestión de Pedido Activo (Toma de Pedido) ---

  seleccionarMesaParaPedido(mesaId: number) {
    const mesa = this._mesas().find(m => m.id === mesaId);
    if (!mesa) return;

    // Si ya tiene una orden activa, la cargamos. Si no, creamos un "Borrador" simulado.
    if (mesa.ordenActual) {
      this._pedidoActivo.set(mesa.ordenActual);
    } else {
      const borrador: Pedido = {
        id: `B-${Date.now()}`,
        numero: this._ordenesHistorial().length + 1,
        mesaId: mesa.id.toString(),
        meseroId: '1', // Simulado
        estado: EstadoPedido.ESPERA, // En el futuro será BORRADOR según tu backend
        destino: 'COCINA',
        horaCreacion: new Date(),
        items: [],
        total: 0
      };
      this._pedidoActivo.set(borrador);
    }
  }

  agregarProductoAlPedido(productoId: string, nombre: string, precioUnit: number, observacion: string = '') {
    this._pedidoActivo.update(pedido => {
      if (!pedido) return null;
      
      const newItem = { productoId, nombre, cantidad: 1, precioUnit, observacion };
      const items = [...pedido.items, newItem];
      const total = items.reduce((sum, item) => sum + (item.precioUnit * item.cantidad), 0);
      
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

  confirmarPedidoActivo() {
    const pedido = this._pedidoActivo();
    if (!pedido) return;

    // Aquí a futuro llamarás al API (PATCH /api/pedidos/{id}/confirmar)
    // Por ahora, simulamos que pasa a PREPARACION y ocupamos la mesa
    const pedidoConfirmado = { ...pedido, estado: EstadoPedido.PREPARACION };
    
    this._mesas.update(mesas => mesas.map(m => {
      if (m.id.toString() === pedido.mesaId) {
        return { ...m, estado: 'ocupada', ordenActual: pedidoConfirmado };
      }
      return m;
    }));

    this._ordenesHistorial.update(historial => [pedidoConfirmado, ...historial]);
    this.limpiarPedidoActivo();
    this.guardarDatos();
  }
}

