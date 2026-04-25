import { Injectable, signal } from '@angular/core';

export interface AlertaStock {
  id: number;
  codigoInterno: string;
  bien: string;
  cantidadActual: number;
  cantidadMinima: number;
  unidad: string;
  prioridad: 'Crítica' | 'Alta' | 'Media';
  estado: 'Activa' | 'Resuelta';
  diasRestantes: number;
  valorEnRiesgo: number;
  fechaAlerta: string;
  resueltaPor?: string;
  accionTomada?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private state = {
    totalBienes: signal(1284),
    alertasStock: signal<AlertaStock[]>([
      { id: 1, codigoInterno: 'SENA-AOL-001', bien: 'Aceite de Oliva Extra Virgen', cantidadActual: 0, cantidadMinima: 50, unidad: 'L', prioridad: 'Crítica', estado: 'Activa', diasRestantes: 0, valorEnRiesgo: 1200000, fechaAlerta: 'Hoy, 08:30' },
      { id: 2, codigoInterno: 'SENA-HTP-002', bien: 'Harina de Trigo Premium', cantidadActual: 12, cantidadMinima: 100, unidad: 'Kg', prioridad: 'Alta', estado: 'Activa', diasRestantes: 2, valorEnRiesgo: 450000, fechaAlerta: 'Hace 2h' },
      { id: 3, codigoInterno: 'SENA-CAR-015', bien: 'Pechuga de Pollo', cantidadActual: 45, cantidadMinima: 50, unidad: 'Kg', prioridad: 'Media', estado: 'Activa', diasRestantes: 5, valorEnRiesgo: 800000, fechaAlerta: 'Hace 5h' }
    ]),
    movimientos: signal([
      { id: 1, bien: 'Tomate Chonto', tipo: 'Entry', responsable: 'Juan Pérez', fecha: 'Hoy, 10:45', cantidad: 100, unidad: 'Kg' },
      { id: 2, bien: 'Cebolla Cabezona', tipo: 'Exit', responsable: 'Ana Martínez', fecha: 'Ayer, 18:20', cantidad: 25, unidad: 'Kg' },
      { id: 3, bien: 'Arroz Blanco', tipo: 'Entry', responsable: 'Carlos Ruiz', fecha: 'Ayer, 14:15', cantidad: 500, unidad: 'Kg' }
    ])
  };

  public getters = {
    totalBienes: this.state.totalBienes.asReadonly(),
    alertasStock: this.state.alertasStock.asReadonly(),
    movimientos: this.state.movimientos.asReadonly()
  };

  resolverAlerta(id: number, accion: string) {
    this.state.alertasStock.update(alertas =>
      alertas.map(a => a.id === id ? { ...a, estado: 'Resuelta', accionTomada: accion, resueltaPor: 'Admin' } : a)
    );
  }
}
