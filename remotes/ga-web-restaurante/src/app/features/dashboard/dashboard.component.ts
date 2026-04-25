import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService, ProductoAlerta } from '../../core/services/dashboard.service';
import { Mesa } from '../../core/models/mesa.model';
import { Orden } from '../../core/models/orden.model';
import { Actividad, ActividadTipo } from '../../core/models/actividad.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  mesas: Mesa[] = [];
  ordenes: Orden[] = [];
  actividad: Actividad[] = [];
  actividadFiltrada: Actividad[] = [];
  productos: ProductoAlerta[] = [];

  mesasOcupadas = 0;
  totalMesas = 0;
  porcentajeOcupacion = 0;
  pedidosPendientes = 0;
  ingresosDia = 0;
  fechaHoy = '';

  filtroActivo: ActividadTipo | 'todos' = 'todos';
  filtros: { label: string; valor: ActividadTipo | 'todos' }[] = [
    { label: 'Todos',    valor: 'todos'    },
    { label: 'Órdenes',  valor: 'orden'    },
    { label: 'Alertas',  valor: 'alerta'   },
    { label: 'Usuarios', valor: 'usuario'  },
    { label: 'Mesas',    valor: 'mesa'     },
  ];

  // Estado de modales
  modalMesa: Mesa | null = null;
  modalOrden: Orden | null = null;
  modalProducto: ProductoAlerta | null = null;

  ngOnInit(): void {
    this.mesas     = this.dashboardService.getMesas();
    this.ordenes   = this.dashboardService.getOrdenes();
    this.actividad = this.dashboardService.getActividad();
    this.actividadFiltrada = [...this.actividad];
    this.productos = this.dashboardService.getProductosAlerta();

    this.totalMesas          = this.mesas.length;
    this.mesasOcupadas       = this.dashboardService.getMesasOcupadas(this.mesas);
    this.porcentajeOcupacion = this.dashboardService.getPorcentajeOcupacion(this.mesas);
    this.pedidosPendientes   = this.ordenes.filter(o => o.estado !== 'completado').length;
    this.ingresosDia         = this.ordenes
      .filter(o => o.estado === 'completado')
      .reduce((acc, o) => acc + o.total, 0);

    this.fechaHoy = new Date().toLocaleDateString('es-CO', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // Navegación
  irA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  // Modales — abrir
  abrirModalMesa(mesa: Mesa): void {
    this.modalMesa = mesa;
  }

  abrirModalOrden(orden: Orden): void {
    this.modalOrden = orden;
  }

  abrirModalProducto(producto: ProductoAlerta): void {
    this.modalProducto = producto;
  }

  // Modales — cerrar
  cerrarModales(): void {
    this.modalMesa     = null;
    this.modalOrden    = null;
    this.modalProducto = null;
  }

  // Navegar desde modal
  irDesdeModal(ruta: string): void {
    this.cerrarModales();
    this.router.navigate([ruta]);
  }

  // Filtro actividad
  aplicarFiltro(filtro: ActividadTipo | 'todos'): void {
    this.filtroActivo = filtro;
    this.actividadFiltrada = filtro === 'todos'
      ? [...this.actividad]
      : this.actividad.filter(a => a.tipo === filtro);
  }

  // Helpers
  getActividadColor(tipo: string): string {
    const colores: Record<string, string> = {
      orden:      '#27AE60',
      completado: '#1565c0',
      alerta:     '#E67E22',
      usuario:    '#8E44AD',
      mesa:       '#16A085',
    };
    return colores[tipo] ?? '#888';
  }

  getAlertaClase(unidades: number, minimo: number): string {
    if (unidades <= minimo)     return 'alerta-item--critica';
    if (unidades <= minimo * 2) return 'alerta-item--advertencia';
    return '';
  }

  getEstadoMesaClase(estado: string): string {
    return 'estado-badge--' + estado.toLowerCase();
  }

  getTotalItems(orden: Orden): number {
    return orden.items?.reduce((acc, i) => acc + i.cantidad, 0) ?? 0;
  }
}