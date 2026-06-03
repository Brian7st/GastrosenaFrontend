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
import { GenerarReporteRequest, ReporteReciente, TipoReporte, PeriodicidadReporte } from '../models/reportes.model';

interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
}

interface SeccionReportes {
  rol: string;
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

  readonly tipoSeleccionado = signal<TipoReporte | 'todos'>('todos');
  readonly periodicidadSeleccionada = signal<PeriodicidadReporte | ''>('');

  // ── Estado del facade ─────────────────────────────────────────────────────
  readonly reportesRecientes = this.facade.reportesRecientes;
  readonly cargando = this.facade.cargando;
  readonly generando = this.facade.generando;
  readonly error = this.facade.error;

  readonly tipoOpciones = [
    { label: 'Todos los tipos', value: 'todos' },
    { label: 'Contadora',      value: 'contadora' },
    { label: 'Administrador',  value: 'administrador' },
    { label: 'Chef',           value: 'chef' },
  ];

  readonly periodicidadOpciones = [
    { label: 'Seleccionar',  value: ''           },
    { label: 'Diario',       value: 'diario'     },
    { label: 'Semanal',      value: 'semanal'    },
    { label: 'Mensual',      value: 'mensual'    },
    { label: 'Trimestral',   value: 'trimestral' },
  ];

  readonly secciones: SeccionReportes[] = [
    {
      rol: 'Contadora',
      icono: 'bar-chart-2',
      color: 'warning',
      reportes: [
        { id: 'bienes',        titulo: 'Bienes',         descripcion: 'Listado detallado de bienes registrados en el sistema.',      tipo: 'contadora' },
        { id: 'insumos',       titulo: 'Insumos',        descripcion: 'Relación de insumos consumidos y disponibles en cocina.',     tipo: 'contadora' },
        { id: 'facturacion',   titulo: 'Facturación',    descripcion: 'Resumen de facturas emitidas en el período seleccionado.',    tipo: 'contadora' },
        { id: 'inventario',    titulo: 'Inventario',     descripcion: 'Estado actual del inventario con entradas y salidas.',        tipo: 'contadora' },
        { id: 'prefactura',    titulo: 'Pre-factura',    descripcion: 'Pre-facturas generadas pendientes de aprobación.',            tipo: 'contadora' },
        { id: 'factura-global',titulo: 'Factura Global', descripcion: 'Consolidado global de todas las facturas del período.',      tipo: 'contadora' },
        { id: 'presupuesto',   titulo: 'Presupuesto',    descripcion: 'Comparativo entre presupuesto asignado y gasto real.',       tipo: 'contadora' },
        { id: 'conciliacion',  titulo: 'Conciliación',   descripcion: 'Conciliación de ingresos y egresos contables.',              tipo: 'contadora' },
      ],
    },
    {
      rol: 'Administrador',
      icono: 'user',
      color: 'danger',
      reportes: [
        { id: 'pedidos-cocina',titulo: 'Pedidos de Cocina',      descripcion: 'Volumen y tiempos de pedidos procesados por cocina.',          tipo: 'administrador' },
        { id: 'ventas-mesero', titulo: 'Ventas por Mesero',      descripcion: 'Total de ventas generadas por cada mesero en el período.',     tipo: 'administrador' },
      ],
    },
    {
      rol: 'Chef',
      icono: 'chef-hat',
      color: 'warning',
      reportes: [
        { id: 'pedidos-cocina-chef',  titulo: 'Pedidos de Cocina', descripcion: 'Pedidos recibidos, en proceso y completados en cocina.',           tipo: 'chef' },
        { id: 'ventas-mesero-chef',   titulo: 'Ventas por Mesero', descripcion: 'Consulta de platos más vendidos según mesero asignado.',           tipo: 'chef' },
      ],
    },
  ];

  readonly seccionesFiltradas = computed(() => {
    const tipo = this.tipoSeleccionado();
    if (tipo === 'todos') return this.secciones;
    return this.secciones.filter(s => s.rol.toLowerCase() === tipo);
  });

  ngOnInit(): void {
    this.facade.cargarReportesRecientes();
  }

  onGenerarReporte(): void {
    const request: GenerarReporteRequest = {
      reporteId: '',
      periodicidad: this.periodicidadSeleccionada(),
      tipo: this.tipoSeleccionado(),
    };
    this.facade.generarReporte(request);
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