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

  // Categorías reales del catálogo de bienes
  categorias = this.facade.categoriasSummary;

  // Mapa de iconos por categoría (coincide con catalog_productos.categoria del seed)
  private readonly iconoPorCategoria: Record<string, string> = {
    'Abarrotes y Secos':       'box',
    'Bebidas y Liquidos':      'glass-water',
    'Fruver':                  'leaf',
    'Reposteria y Congelados': 'snowflake',
  };

  iconoDeCategoria(nombre: string): string {
    return this.iconoPorCategoria[nombre] ?? 'package';
  }

  // ─── Datos de UI locales (decoración) ───
  tendencias = signal([
    { mes: 'Ene', valor: 60, isCurrent: false },
    { mes: 'Feb', valor: 50, isCurrent: false },
    { mes: 'Mar', valor: 55, isCurrent: false },
    { mes: 'Abr', valor: 40, isCurrent: false },
    { mes: 'May', valor: 30, isCurrent: false },
    { mes: 'Jun', valor: 25, isCurrent: true },
  ]);

  actividades = signal([
    { id: 1, ubicacion: 'Cocina Principal',    detalle: 'Conciliación cerrada',           tiempo: 'Hace 10 min',  estado: 'ok'      },
    { id: 2, ubicacion: 'Almacén de Insumos',  detalle: 'Ajuste de inventario (#AJ-102)', tiempo: 'Hace 45 min',  estado: 'neutral' },
    { id: 3, ubicacion: 'Bodega Refrigerados', detalle: 'Toma física iniciada',           tiempo: 'Hace 2 horas', estado: 'neutral' },
    { id: 4, ubicacion: 'Área de Carnes',      detalle: 'Discrepancia detectada > 5%',    tiempo: 'Ayer, 16:30',  estado: 'alert'   },
  ]);

  ngOnInit(): void {
    this.facade.loadAll();
    this.facade.cargarTomaFisicaItems();
  }
}
