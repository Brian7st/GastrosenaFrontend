import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { I18nService } from '@restaurant/shell';
import { AuthService } from '@restaurant/shared/auth';
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
  private readonly i18n = inject(I18nService);
  private readonly auth = inject(AuthService);

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

    const t = (k: string) => this.i18n.t(k);
    return [
      {
        label: t('dashboard.kpi.pedidos_activos'),
        value: String(this._pedidosActivos()),
        trend: t('dashboard.kpi.en_preparacion'),
        trendType: this._pedidosActivos() > 0 ? 'info' : 'neutral',
        icon: 'utensils',
      },
      {
        label: t('dashboard.kpi.mesas_ocupadas'),
        value: totalMesas > 0 ? `${ocupadas} / ${totalMesas}` : '—',
        trend: `${porcentaje}% ${t('dashboard.kpi.ocupacion')}`,
        trendType: porcentaje > 80 ? 'alert' : porcentaje > 50 ? 'positive' : 'neutral',
        icon: 'layout-grid',
      },
      {
        label: t('dashboard.kpi.alertas_stock'),
        value: alertas ? String(alertas.alertasPendientes) : '—',
        trend: alertas ? `${alertas.productosCriticos} ${t('dashboard.kpi.productos_criticos')}` : t('dashboard.kpi.sin_datos'),
        trendType: alertas && alertas.alertasPendientes > 0 ? 'alert' : 'neutral',
        icon: 'triangle-alert',
      },
      {
        label: t('dashboard.kpi.facturas_pendientes'),
        value: facturas ? String(facturas.totalRegistradas) : '—',
        trend: facturas ? `$${this.formatMoney(facturas.montoRegistradas)} ${t('dashboard.kpi.por_verificar')}` : t('dashboard.kpi.sin_datos'),
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
    const rol = this.auth.currentUser()?.rol ?? '';
    const t = (k: string) => this.i18n.t(k);

    const todos: ModuleCard[] = [
      {
        label: t('nav.cocina'),
        description: t('dashboard.mod.cocina.desc'),
        icon: 'chef-hat',
        ruta: '/app/cocina',
        roles: ['ADMINISTRADOR', 'INSTRUCTOR', 'CHEF', 'AUXILIAR_COCINA', 'APRENDIZ'],
      },
      {
        label: t('nav.bar'),
        description: t('dashboard.mod.bar.desc'),
        icon: 'wine',
        ruta: '/app/bar',
        roles: ['ADMINISTRADOR', 'INSTRUCTOR', 'BARTENDER', 'APRENDIZ'],
      },
      {
        label: t('nav.restaurante'),
        description: t('dashboard.mod.restaurante.desc'),
        icon: 'utensils',
        ruta: '/app/restaurante',
        roles: ['ADMINISTRADOR', 'INSTRUCTOR', 'MESERO', 'CAJERO', 'APRENDIZ'],
      },
      {
        label: t('nav.inventario'),
        description: t('dashboard.mod.inventario.desc'),
        icon: 'package',
        ruta: '/app/inventario',
        badgeCount: alertas?.alertasPendientes ?? undefined,
        badgeType: alertas && alertas.alertasPendientes > 0 ? 'alert' : undefined,
        roles: ['ADMINISTRADOR', 'CONTADORA', 'INSTRUCTOR'],
      },
      {
        label: t('dashboard.mod.facturacion'),
        description: t('dashboard.mod.facturacion.desc'),
        icon: 'file-text',
        ruta: '/app/inventario/facturas',
        badgeCount: facturas?.totalRegistradas ?? undefined,
        badgeType: facturas && facturas.totalRegistradas > 0 ? 'info' : undefined,
        roles: ['ADMINISTRADOR', 'CONTADORA', 'CAJERO'],
      },
      {
        label: t('dashboard.mod.presupuesto'),
        description: t('dashboard.mod.presupuesto.desc'),
        icon: 'wallet',
        ruta: '/app/inventario/presupuesto',
        roles: ['ADMINISTRADOR', 'CONTADORA'],
      },
      {
        label: t('dashboard.mod.requisiciones'),
        description: t('dashboard.mod.requisiciones.desc'),
        icon: 'clipboard-list',
        ruta: '/app/inventario/requisiciones',
        roles: ['ADMINISTRADOR', 'CONTADORA', 'INSTRUCTOR'],
      },
      {
        label: t('dashboard.mod.reportes'),
        description: t('dashboard.mod.reportes.desc'),
        icon: 'bar-chart-2',
        ruta: '/app/reportes',
        roles: ['ADMINISTRADOR', 'CONTADORA', 'INSTRUCTOR'],
      },
      {
        label: t('dashboard.mod.usuarios'),
        description: t('dashboard.mod.usuarios.desc'),
        icon: 'users',
        ruta: '/app/usuarios',
        roles: ['ADMINISTRADOR'],
      },
      {
        label: t('dashboard.mod.notificaciones'),
        description: t('dashboard.mod.notificaciones.desc'),
        icon: 'bell',
        ruta: '/app/notificaciones',
        roles: ['ADMINISTRADOR', 'CONTADORA', 'INSTRUCTOR', 'CHEF', 'MESERO', 'BARTENDER', 'AUXILIAR_COCINA', 'CAJERO', 'APRENDIZ'],
      },
    ];

    return todos.filter(m => !m.roles || m.roles.includes(rol));
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
