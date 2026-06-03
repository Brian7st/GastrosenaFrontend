import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent, KpiCardComponent } from '@restaurant/shared/ui';
import { ConciliacionFacade } from '../../../data-access/conciliacion.facade';

@Component({
  selector: 'restaurant-conciliacion-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconComponent,
    ButtonComponent,
    KpiCardComponent,
  ],
  templateUrl: './conciliacion-dashboard.component.html',
  styleUrl: './conciliacion-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionDashboardComponent implements OnInit {
  protected facade = inject(ConciliacionFacade);

  // Signals expuestos desde la facade (solo lectura)
  conciliaciones     = this.facade.conciliaciones;
  loading            = this.facade.loading;
  error              = this.facade.error;

  // KPIs derivados del historial real
  totalConciliaciones = this.facade.totalConciliaciones;
  precisionPromedio   = this.facade.precisionPromedio;
  diferenciasTotal    = this.facade.diferenciasTotal;

  // ─── Datos de UI locales como signals ───
  tendencias = signal([
    { mes: 'Ene', valor: 60, isCurrent: false },
    { mes: 'Feb', valor: 50, isCurrent: false },
    { mes: 'Mar', valor: 55, isCurrent: false },
    { mes: 'Abr', valor: 40, isCurrent: false },
    { mes: 'May', valor: 30, isCurrent: false },
    { mes: 'Jun', valor: 25, isCurrent: true },
  ]);

  actividades = signal([
    {
      id: 1,
      ubicacion: 'Cocina Principal',
      detalle: 'Conciliación cerrada por Ana M.',
      tiempo: 'Hace 10 min',
      estado: 'ok',
    },
    {
      id: 2,
      ubicacion: 'Almacén de Insumos',
      detalle: 'Ajuste de inventario (#AJ-102)',
      tiempo: 'Hace 45 min',
      estado: 'neutral',
    },
    {
      id: 3,
      ubicacion: 'Bodega Refrigerados',
      detalle: 'Toma física iniciada',
      tiempo: 'Hace 2 horas',
      estado: 'neutral',
    },
    {
      id: 4,
      ubicacion: 'Área de Carnes',
      detalle: 'Discrepancia detectada > 5%',
      tiempo: 'Ayer, 16:30',
      estado: 'alert',
    },
  ]);

  categorias = signal([
    {
      nombre: 'Abarrotes',
      icono: 'box',
      estado: 'Última toma: Hace 2 días',
      tipo: 'normal',
    },
    {
      nombre: 'Lácteos',
      icono: 'coffee',
      estado: 'Última toma: Hoy, 08:30 AM',
      tipo: 'normal',
    },
    {
      nombre: 'Carnes',
      icono: 'utensils',
      estado: 'Revisión requerida',
      tipo: 'alert',
    },
    {
      nombre: 'Frutas-Vegetales',
      icono: 'package-open',
      estado: 'Última toma: Ayer',
      tipo: 'normal',
    },
  ]);

  ngOnInit(): void {
    this.facade.loadAll();
  }
}
