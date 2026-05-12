import { Injectable, signal, computed } from '@angular/core';
import { Mesa, RestauranteStats } from '../models/restaurante.model';
import { Pedido, EstadoPedido } from '@restaurant/shared/models';

@Injectable({ providedIn: 'root' })
export class RestauranteFacade {
  // Estado privado con Signals
  private _mesas = signal<Mesa[]>([]);
  private _ordenesHistorial = signal<Pedido[]>([]);

  // Selectores públicos (Signals)
  readonly mesas = this._mesas.asReadonly();
  readonly ordenesHistorial = this._ordenesHistorial.asReadonly();

  // KPIs computados
  readonly stats = computed<RestauranteStats>(() => {
    const mesas = this._mesas();
    const totalMesas = mesas.length;
    const mesasOcupadas = mesas.filter(m => m.estado !== 'libre').length;
    const porcentajeOcupacion = totalMesas > 0 ? Math.round((mesasOcupadas / totalMesas) * 100) : 0;
    
    // Contar pedidos que no estén ENTREGADOS o CANCELADOS en las mesas activas
    const pedidosPendientes = mesas.filter(m => 
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
      ordenActual: null,
      notas: ''
    };

    this._mesas.set([...mesas, nuevaMesa]);
    this.guardarDatos();
  }

  abrirMesa(id: number, comensal: string) {
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
        return { ...m, estado: 'ocupada', comensal, ordenActual: nuevaOrden };
      }
      return m;
    }));
    this.guardarDatos();
  }

  eliminarMesa(id: number) {
    this._mesas.update(mesas => mesas.filter(m => m.id !== id));
    this.guardarDatos();
  }

  liberarMesa(id: number) {
    this._mesas.update(mesas => mesas.map(m => {
      if (m.id === id) {
        return { ...m, estado: 'libre', comensal: '', ordenActual: null };
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
}

