import { Injectable } from '@angular/core';
import { Mesa } from '../models/mesa.model';
import { Orden } from '../models/orden.model';
import { Actividad } from '../models/actividad.model';

export interface ProductoAlerta {
  nombre: string;
  categoria: string;
  unidades: number;
  minimo: number;
  descripcion: string;
  ultimoIngreso: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  getMesas(): Mesa[] {
    return [
      { id: 1, nombre: 'Mesa 1', asientos: 2, estado: 'Libre' },
      { id: 2, nombre: 'Mesa 2', asientos: 4, estado: 'Ocupado', cliente: 'María González', tiempoOcupada: '45 min' },
      { id: 3, nombre: 'Mesa 3', asientos: 4, estado: 'Espera' },
      { id: 4, nombre: 'Mesa 4', asientos: 6, estado: 'Libre' },
      { id: 5, nombre: 'Mesa 5', asientos: 2, estado: 'Ocupado', cliente: 'Carlos Pérez', tiempoOcupada: '20 min' },
      { id: 6, nombre: 'Mesa 6', asientos: 8, estado: 'Libre' },
      { id: 7, nombre: 'Mesa 7', asientos: 4, estado: 'Espera' },
      { id: 8, nombre: 'Mesa 8', asientos: 2, estado: 'Libre' },
    ];
  }

  getOrdenes(): Orden[] {
    return [
      {
        id: 'ORD001',
        mesa: 'Mesa 2',
        cliente: 'María González',
        estado: 'en preparacion',
        total: 45000,
        hora: '10:30 AM',
        items: [
          { nombre: 'Bandeja Paisa',   cantidad: 1, precio: 25000 },
          { nombre: 'Jugo de Naranja', cantidad: 2, precio: 8000  },
          { nombre: 'Agua Cristal',    cantidad: 1, precio: 4000  },
        ]
      },
      {
        id: 'ORD002',
        mesa: 'Mesa 5',
        cliente: 'Carlos Pérez',
        estado: 'abierto',
        total: 32000,
        hora: '10:45 AM',
        items: [
          { nombre: 'Sancocho',        cantidad: 1, precio: 18000 },
          { nombre: 'Limonada',        cantidad: 2, precio: 7000  },
        ]
      },
    ];
  }

  getActividad(): Actividad[] {
    return [
      { descripcion: 'Nueva orden Mesa 2',               hora: '10:30 AM', tipo: 'orden' },
      { descripcion: 'Pedido completado Mesa 5',         hora: '10:25 AM', tipo: 'completado' },
      { descripcion: 'Stock bajo: Cerveza Corona',       hora: '10:20 AM', tipo: 'alerta' },
      { descripcion: 'Usuario conectado: María González',hora: '10:15 AM', tipo: 'usuario' },
      { descripcion: 'Mesa 3 ocupada',                   hora: '10:10 AM', tipo: 'mesa' },
    ];
  }

  getProductosAlerta(): ProductoAlerta[] {
    return [
      {
        nombre: 'Máquina de Café',
        categoria: 'bar',
        unidades: 1,
        minimo: 1,
        descripcion: 'Cápsulas de café espresso para la máquina del bar.',
        ultimoIngreso: '05/04/2026'
      },
      {
        nombre: 'Cerveza Corona',
        categoria: 'bebidas',
        unidades: 3,
        minimo: 5,
        descripcion: 'Cerveza Corona 330ml botella.',
        ultimoIngreso: '08/04/2026'
      },
    ];
  }

  getMesasOcupadas(mesas: Mesa[]): number {
    return mesas.filter(m => m.estado === 'Ocupado').length;
  }

  getPorcentajeOcupacion(mesas: Mesa[]): number {
    return Math.round((this.getMesasOcupadas(mesas) / mesas.length) * 100);
  }
}