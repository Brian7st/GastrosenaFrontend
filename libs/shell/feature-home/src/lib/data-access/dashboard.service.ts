import { Injectable, signal, computed } from '@angular/core';
import {
  AlertaStock,
  MovimientoReciente,
  KpiCard,
  AccesoRapido,
  ItemPresupuestal,
} from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly _alertasStock = signal<AlertaStock[]>([
    { id: 1, bien: 'Aceite de Oliva', codigoInterno: 'SEN-001', cantidadActual: 2, cantidadMinima: 10, unidad: 'L', prioridad: 'Crítica' },
    { id: 2, bien: 'Harina de Trigo', codigoInterno: 'SEN-002', cantidadActual: 5, cantidadMinima: 20, unidad: 'Kg', prioridad: 'Alta' },
    { id: 3, bien: 'Leche Entera', codigoInterno: 'SEN-003', cantidadActual: 8, cantidadMinima: 15, unidad: 'L', prioridad: 'Alta' },
    { id: 4, bien: 'Azúcar Refinada', codigoInterno: 'SEN-004', cantidadActual: 12, cantidadMinima: 25, unidad: 'Kg', prioridad: 'Media' },
  ]);

  private readonly _movimientos = signal<MovimientoReciente[]>([
    { id: 1, bien: 'Pechuga de Pollo', tipo: 'Entry', responsable: 'Carlos M.', fecha: 'Hoy 09:15', cantidad: 50, unidad: 'Kg' },
    { id: 2, bien: 'Aceite de Oliva', tipo: 'Exit', responsable: 'Ana R.', fecha: 'Hoy 08:40', cantidad: 3, unidad: 'L' },
    { id: 3, bien: 'Queso Mozzarella', tipo: 'Entry', responsable: 'Luis P.', fecha: 'Ayer 16:30', cantidad: 10, unidad: 'Kg' },
    { id: 4, bien: 'Harina de Trigo', tipo: 'Exit', responsable: 'María S.', fecha: 'Ayer 14:00', cantidad: 8, unidad: 'Kg' },
    { id: 5, bien: 'Tomates', tipo: 'Entry', responsable: 'Carlos M.', fecha: 'Ayer 11:20', cantidad: 30, unidad: 'Kg' },
  ]);

  readonly kpis = computed<KpiCard[]>(() => [
    { label: 'Total de Bienes', value: '1.284', trend: '+4.2%', trendType: 'positive', icon: 'package', colorVariant: 'primary' },
    { label: 'Valor Total Inventario', value: '$87.450.000', trend: '+12%', trendType: 'positive', icon: 'circle-dollar-sign', colorVariant: 'secondary' },
    { label: 'Productos Bajo Stock', value: String(this._alertasStock().length), trend: '+8 hoy', trendType: 'alert', icon: 'triangle-alert', colorVariant: 'alert' },
    { label: 'Facturas Pendientes', value: '8', trend: '-2 sem', trendType: 'neutral', icon: 'receipt', colorVariant: 'muted' },
  ]);

  readonly alertasStock = this._alertasStock.asReadonly();
  readonly movimientos = this._movimientos.asReadonly();

  readonly accesoRapido: AccesoRapido[] = [
    { label: 'Gestión de Bienes', icon: 'package', ruta: '/inventario/bienes' },
    { label: 'Facturas Electrónicas', icon: 'receipt', ruta: '/facturacion' },
    { label: 'GIL-F-014', icon: 'file-text', ruta: '/abastecimiento/gil' },
    { label: 'Consolidado Presupuestal', icon: 'file-stack', ruta: '/presupuesto/consolidado' },
    { label: 'Requisiciones', icon: 'arrow-left-right', ruta: '/requisiciones' },
    { label: 'Alertas de Stock', icon: 'bell', ruta: '/inventario/alertas' },
    { label: 'Presupuesto', icon: 'wallet', ruta: '/presupuesto' },
    { label: 'Conciliación', icon: 'scale', ruta: '/inventario/conciliacion' },
  ];

  readonly resumenPresupuestal: ItemPresupuestal[] = [
    { label: 'Presupuesto Utilizado', valor: '$52.400.000 / $80M', porcentaje: 65.5, nota: 'Equivalente al 65.5% del total anual asignado.', colorVariant: 'primary' },
    { label: 'Compras Programadas', valor: '$12.150.000', porcentaje: 45, nota: 'Adquisiciones aprobadas para el Q4.', colorVariant: 'secondary' },
    { label: 'Reserva de Emergencia', valor: '$4.500.000 disponible', porcentaje: 15, nota: 'Fondos retenidos para contingencias críticas.', colorVariant: 'alert' },
  ];

  stockPorcentaje(alerta: AlertaStock): number {
    return Math.min((alerta.cantidadActual / alerta.cantidadMinima) * 100, 100);
  }
}
