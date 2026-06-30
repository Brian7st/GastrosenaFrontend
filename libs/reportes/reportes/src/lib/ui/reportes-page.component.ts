import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageHeaderComponent,
  SelectFilterComponent,
  ButtonComponent,
  StatusBadgeComponent,
  DataTableComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';
import { ReportesFacade } from '../data-access/reportes.facade';
import { GenerarReporteRequest, TipoReporte, PeriodicidadReporte } from '../models/reportes.model';
import { I18nService } from '../i18n/i18n.service';

interface Reporte {
  id: string;
  tKey: string;
  dKey: string;
  titulo?: string;
  descripcion?: string;
  tipo: string;
}

interface SeccionReportes {
  rolKey: string;
  rol?: string;
  icono: string;
  color: string;
  reportes: Reporte[];
}

@Component({
  selector: 'restaurant-reportes-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    SelectFilterComponent,
    ButtonComponent,
    StatusBadgeComponent,
    DataTableComponent,
    LucideIconComponent,
  ],
  templateUrl: './reportes-page.component.html',
  styleUrl: './reportes-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportesPageComponent implements OnInit {
  private readonly facade = inject(ReportesFacade);
  protected readonly i18n = inject(I18nService);

  readonly tipoSeleccionado = signal<TipoReporte | 'todos'>('todos');
  readonly periodicidadSeleccionada = signal<PeriodicidadReporte | ''>('');

  // ── Estado del facade ─────────────────────────────────────────────────────
  readonly reportesRecientes = this.facade.reportesRecientes;
  readonly cargando = this.facade.cargando;
  readonly generando = this.facade.generando;
  readonly error = this.facade.error;

  readonly tipoOpciones = computed(() => [
    { label: this.i18n.t('filter.tipo.todos'), value: 'todos' },
    { label: this.i18n.t('filter.tipo.contadora'), value: 'contadora' },
    { label: this.i18n.t('filter.tipo.administrador'), value: 'administrador' },
    { label: this.i18n.t('filter.tipo.chef'), value: 'chef' },
  ]);

  readonly periodicidadOpciones = computed(() => [
    { label: this.i18n.t('filter.periodicidad.seleccionar'), value: '' },
    { label: this.i18n.t('filter.periodicidad.diario'), value: 'diario' },
    { label: this.i18n.t('filter.periodicidad.semanal'), value: 'semanal' },
    { label: this.i18n.t('filter.periodicidad.mensual'), value: 'mensual' },
    { label: this.i18n.t('filter.periodicidad.trimestral'), value: 'trimestral' },
  ]);

  private readonly seccionesBase: SeccionReportes[] = [
    {
      rolKey: 'rol.contadora',
      icono: 'bar-chart-2',
      color: 'warning',
      reportes: [
        { id: 'bienes',        tKey: 'reporte.bienes',         dKey: 'reporte.bienes.desc',         tipo: 'contadora' },
        { id: 'insumos',       tKey: 'reporte.insumos',        dKey: 'reporte.insumos.desc',        tipo: 'contadora' },
        { id: 'facturacion',   tKey: 'reporte.facturacion',    dKey: 'reporte.facturacion.desc',    tipo: 'contadora' },
        { id: 'inventario',    tKey: 'reporte.inventario',     dKey: 'reporte.inventario.desc',     tipo: 'contadora' },
        { id: 'prefactura',    tKey: 'reporte.prefactura',     dKey: 'reporte.prefactura.desc',     tipo: 'contadora' },
        { id: 'factura-global',tKey: 'reporte.factura_global', dKey: 'reporte.factura_global.desc', tipo: 'contadora' },
        { id: 'presupuesto',   tKey: 'reporte.presupuesto',    dKey: 'reporte.presupuesto.desc',    tipo: 'contadora' },
        { id: 'conciliacion',  tKey: 'reporte.conciliacion',   dKey: 'reporte.conciliacion.desc',   tipo: 'contadora' },
      ],
    },
    {
      rolKey: 'rol.administrador',
      icono: 'user',
      color: 'danger',
      reportes: [
        { id: 'pedidos-cocina', tKey: 'reporte.pedidos_cocina',     dKey: 'reporte.pedidos_cocina.desc',     tipo: 'administrador' },
        { id: 'ventas-mesero',  tKey: 'reporte.ventas_mesero',      dKey: 'reporte.ventas_mesero.desc',      tipo: 'administrador' },
      ],
    },
    {
      rolKey: 'rol.chef',
      icono: 'chef-hat',
      color: 'warning',
      reportes: [
        { id: 'pedidos-cocina-chef', tKey: 'reporte.pedidos_cocina_chef',   dKey: 'reporte.pedidos_cocina_chef.desc',   tipo: 'chef' },
        { id: 'ventas-mesero-chef',  tKey: 'reporte.ventas_mesero_chef',    dKey: 'reporte.ventas_mesero_chef.desc',    tipo: 'chef' },
      ],
    },
  ];

  readonly secciones = computed(() =>
    this.seccionesBase.map(s => ({
      ...s,
      rol: this.i18n.t(s.rolKey),
      reportes: s.reportes.map(r => ({
        ...r,
        titulo: this.i18n.t(r.tKey),
        descripcion: this.i18n.t(r.dKey),
      })),
    }))
  );

  readonly seccionesFiltradas = computed(() => {
    const tipo = this.tipoSeleccionado();
    if (tipo === 'todos') return this.secciones();
    return this.secciones().filter(s => s.rolKey === `rol.${tipo}`);
  });

  ngOnInit(): void {
    this.facade.cargarReportesRecientes();
  }

  onGenerarReporte(): void {
    for (const seccion of this.seccionesFiltradas()) {
      for (const reporte of seccion.reportes) {
        this.generarReporte(reporte.id);
      }
    }
  }

  generarReporte(reporteId: string): void {
    const request: GenerarReporteRequest = {
      reporteId,
      periodicidad: this.periodicidadSeleccionada(),
      tipo: this.tipoSeleccionado(),
    };
    this.facade.generarReporte(request);
  }

  descargarPdf(reporteId: string): void {
    this.facade.descargarPdf(reporteId);
  }

  descargarReporte(reporteId: string): void {
    this.facade.descargarReporte(reporteId);
  }
}