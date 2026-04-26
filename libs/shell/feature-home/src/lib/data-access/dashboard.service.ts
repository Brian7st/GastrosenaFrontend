import { Injectable, signal, computed } from '@angular/core';
import { KpiCard, ModuleCard, ActividadReciente } from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  // TODO: reemplazar con facades de cada dominio
  private readonly _pedidosActivos = signal(12);
  private readonly _mesasOcupadas = signal(8);
  private readonly _alertasStock = signal(4);
  private readonly _facturasPendientes = signal(8);

  readonly kpis = computed<KpiCard[]>(() => [
    {
      label: 'Pedidos Activos',
      value: String(this._pedidosActivos()),
      trend: '+3 última hora',
      trendType: 'info' as never,
      icon: 'utensils',
    },
    {
      label: 'Mesas Ocupadas',
      value: `${this._mesasOcupadas()} / 12`,
      trend: '67% ocupación',
      trendType: 'positive',
      icon: 'layout-grid',
    },
    {
      label: 'Alertas de Stock',
      value: String(this._alertasStock()),
      trend: 'Requieren atención',
      trendType: 'alert',
      icon: 'triangle-alert',
    },
    {
      label: 'Facturas Pendientes',
      value: String(this._facturasPendientes()),
      trend: 'Por procesar',
      trendType: 'neutral',
      icon: 'receipt',
    },
  ]);

  readonly modulos: ModuleCard[] = [
    {
      label: 'Cocina',
      description: 'Pedidos, recetas y tiempos',
      icon: 'chef-hat',
      ruta: '/cocina',
    },
    {
      label: 'Bar',
      description: 'Bebidas y barismo',
      icon: 'wine',
      ruta: '/bar',
    },
    {
      label: 'Restaurante',
      description: 'Mesas, pedidos y comandas',
      icon: 'utensils',
      ruta: '/restaurante',
    },
    {
      label: 'Inventario',
      description: 'Bienes, stock y conciliación',
      icon: 'package',
      ruta: '/inventario',
      badgeCount: 4,
      badgeType: 'alert',
    },
    {
      label: 'Abastecimiento',
      description: 'GIL-F-014 y consolidados',
      icon: 'truck',
      ruta: '/abastecimiento',
    },
    {
      label: 'Facturación',
      description: 'FEL, CUFE y facturas',
      icon: 'file-text',
      ruta: '/facturacion',
      badgeCount: 8,
      badgeType: 'info',
    },
    {
      label: 'Presupuesto',
      description: 'Techos y ejecución ZESE',
      icon: 'wallet',
      ruta: '/presupuesto',
    },
    {
      label: 'Requisiciones',
      description: 'Solicitudes y actas',
      icon: 'clipboard-list',
      ruta: '/requisiciones',
    },
    {
      label: 'Reportes',
      description: 'Exportables PDF y Excel',
      icon: 'bar-chart-2',
      ruta: '/reportes',
    },
    {
      label: 'Usuarios',
      description: 'Roles y permisos',
      icon: 'users',
      ruta: '/usuarios',
    },
    {
      label: 'Notificaciones',
      description: 'Alertas en tiempo real',
      icon: 'bell',
      ruta: '/notificaciones',
    },
  ];

  readonly actividadReciente: ActividadReciente[] = [
    { id: 1, modulo: 'Cocina', descripcion: 'Pedido #042 marcado como listo', usuario: 'Chef Ramírez', hace: 'hace 2 min', tipo: 'info' },
    { id: 2, modulo: 'Inventario', descripcion: 'Stock crítico: Aceite de Oliva', usuario: 'Sistema', hace: 'hace 5 min', tipo: 'alert' },
    { id: 3, modulo: 'Restaurante', descripcion: 'Mesa 7 asignada', usuario: 'Mesero López', hace: 'hace 8 min', tipo: 'entry' },
    { id: 4, modulo: 'Facturación', descripcion: 'Factura #F-2024-089 registrada', usuario: 'Contadora', hace: 'hace 15 min', tipo: 'info' },
    { id: 5, modulo: 'Bar', descripcion: 'Pedido #041 entregado', usuario: 'Bartender Ruiz', hace: 'hace 20 min', tipo: 'exit' },
  ];
}
