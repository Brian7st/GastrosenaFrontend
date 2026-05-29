import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  KpiCard,
  ModuleCard,
  ActividadReciente,
  InventoryKpisResponse,
  AlertasResumenResponse,
  FacturasResumenResponse,
  PresupuestoResumenResponse,
  CocinaKpisResponse,
  BarKpisResponse,
  MesaResponse,
} from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  readonly loading = signal(true);

  private readonly _inventarioKpis = signal<InventoryKpisResponse | null>(null);
  private readonly _alertas = signal<AlertasResumenResponse | null>(null);
  private readonly _facturas = signal<FacturasResumenResponse | null>(null);
  private readonly _presupuesto = signal<PresupuestoResumenResponse | null>(null);
  private readonly _cocinaKpis = signal<CocinaKpisResponse | null>(null);
  private readonly _barKpis = signal<BarKpisResponse | null>(null);
  private readonly _mesas = signal<MesaResponse[]>([]);
  private readonly _pedidosActivos = signal(0);

  readonly kpis = computed<KpiCard[]>(() => {
    const mesas = this._mesas();
    const ocupadas = mesas.filter(m => m.estado === 'OCUPADA' || m.estado === 'POR_PAGAR').length;
    const totalMesas = mesas.filter(m => m.activo).length;
    const porcentaje = totalMesas > 0 ? Math.round((ocupadas / totalMesas) * 100) : 0;
    const alertas = this._alertas();
    const facturas = this._facturas();

    return [
      {
        label: 'Pedidos Activos',
        value: String(this._pedidosActivos()),
        trend: 'En preparación',
        trendType: this._pedidosActivos() > 0 ? 'info' : 'neutral',
        icon: 'utensils',
      },
      {
        label: 'Mesas Ocupadas',
        value: totalMesas > 0 ? `${ocupadas} / ${totalMesas}` : '—',
        trend: `${porcentaje}% ocupación`,
        trendType: porcentaje > 80 ? 'alert' : porcentaje > 50 ? 'positive' : 'neutral',
        icon: 'layout-grid',
      },
      {
        label: 'Alertas de Stock',
        value: alertas ? String(alertas.alertasPendientes) : '—',
        trend: alertas ? `${alertas.productosCriticos} productos críticos` : 'Sin datos',
        trendType: alertas && alertas.alertasPendientes > 0 ? 'alert' : 'neutral',
        icon: 'triangle-alert',
      },
      {
        label: 'Facturas Pendientes',
        value: facturas ? String(facturas.totalRegistradas) : '—',
        trend: facturas ? `$${this.formatMoney(facturas.montoRegistradas)} por verificar` : 'Sin datos',
        trendType: facturas && facturas.totalRegistradas > 5 ? 'alert' : 'neutral',
        icon: 'receipt',
      },
    ];
  });

  readonly operaciones = computed(() => ({
    cocina: this._cocinaKpis(),
    bar: this._barKpis(),
  }));

  readonly inventario = computed(() => ({
    kpis: this._inventarioKpis(),
    alertas: this._alertas(),
    facturas: this._facturas(),
    presupuesto: this._presupuesto(),
  }));

  readonly modulos = computed<ModuleCard[]>(() => {
    const alertas = this._alertas();
    const facturas = this._facturas();
    return [
      { label: 'Cocina', description: 'Pedidos, recetas y tiempos', icon: 'chef-hat', ruta: '/app/cocina' },
      { label: 'Bar', description: 'Bebidas y barismo', icon: 'wine', ruta: '/app/bar' },
      { label: 'Restaurante', description: 'Mesas, pedidos y caja', icon: 'utensils', ruta: '/app/restaurante' },
      {
        label: 'Inventario',
        description: 'Bienes, stock y conciliación',
        icon: 'package',
        ruta: '/app/inventario',
        badgeCount: alertas?.alertasPendientes ?? undefined,
        badgeType: alertas && alertas.alertasPendientes > 0 ? 'alert' : undefined,
      },

      {
        label: 'Facturación',
        description: 'FEL, CUFE y facturas',
        icon: 'file-text',
        ruta: '/app/inventario/facturas',
        badgeCount: facturas?.totalRegistradas ?? undefined,
        badgeType: facturas && facturas.totalRegistradas > 0 ? 'info' : undefined,
      },
      { label: 'Presupuesto', description: 'Techos y ejecución ZESE', icon: 'wallet', ruta: '/app/inventario/presupuesto' },
      { label: 'Requisiciones', description: 'Solicitudes y actas', icon: 'clipboard-list', ruta: '/app/inventario/requisiciones' },
      { label: 'Reportes', description: 'Exportables PDF y Excel', icon: 'bar-chart-2', ruta: '/app/reportes' },
      { label: 'Usuarios', description: 'Roles y permisos', icon: 'users', ruta: '/app/usuarios' },
      { label: 'Notificaciones', description: 'Alertas en tiempo real', icon: 'bell', ruta: '/app/notificaciones' },
    ];
  });

  readonly actividadReciente: ActividadReciente[] = [];

  loadDashboard(): void {
    this.loading.set(true);
    forkJoin({
      inventarioKpis: this.http.get<InventoryKpisResponse>('/api/v1/inventory/kpis').pipe(catchError(() => of(null))),
      alertas: this.http.get<AlertasResumenResponse>('/api/v1/reporting/alertas/resumen').pipe(catchError(() => of(null))),
      facturas: this.http.get<FacturasResumenResponse>('/api/v1/sourcing/facturas/resumen').pipe(catchError(() => of(null))),
      presupuesto: this.http.get<PresupuestoResumenResponse>('/api/v1/budget/presupuestos/resumen').pipe(catchError(() => of(null))),
      cocinaKpis: this.http.get<CocinaKpisResponse>('/api/cocina/estadisticas/kpis').pipe(catchError(() => of(null))),
      barKpis: this.http.get<BarKpisResponse>('/api/barybarismo/estadisticas/kpis').pipe(catchError(() => of(null))),
      mesas: this.http.get<MesaResponse[]>('/api/mesas').pipe(catchError(() => of([]))),
      pedidos: this.http.get<unknown[]>('/api/pedidos/estado/EN_PREPARACION').pipe(catchError(() => of([]))),
    }).subscribe(data => {
      this._inventarioKpis.set(data.inventarioKpis);
      this._alertas.set(data.alertas);
      this._facturas.set(data.facturas);
      this._presupuesto.set(data.presupuesto);
      this._cocinaKpis.set(data.cocinaKpis);
      this._barKpis.set(data.barKpis);
      this._mesas.set(data.mesas as MesaResponse[]);
      this._pedidosActivos.set(Array.isArray(data.pedidos) ? data.pedidos.length : 0);
      this.loading.set(false);
    });
  }

  private formatMoney(amount: number): string {
    return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  }
}
