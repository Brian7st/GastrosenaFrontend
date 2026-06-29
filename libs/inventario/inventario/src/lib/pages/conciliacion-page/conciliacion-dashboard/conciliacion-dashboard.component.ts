import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent, KpiCardComponent } from '@restaurant/shared/ui';
import { ConciliacionFacade } from '../../../data-access/conciliacion.facade';
import { I18nService } from '../../../i18n/i18n.service';

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
  protected readonly i18n = inject(I18nService);

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

  // Tendencia de merma y actividad reciente — derivadas del historial real
  tendencias = this.facade.tendenciaMensual;
  actividades = this.facade.actividadReciente;

  // Mapa de iconos por categoría — alineado con los de la requisición (mismas categorías).
  private readonly iconoPorCategoria: Record<string, string> = {
    'Perecederos':             'thermometer',
    'Fruver':                  'apple',
    'Abarrotes y Secos':       'package',
    'Bebidas y Liquidos':      'droplets',
    'Reposteria y Congelados': 'cake',
  };

  iconoDeCategoria(nombre: string): string {
    return this.iconoPorCategoria[nombre] ?? 'package';
  }

  ngOnInit(): void {
    this.facade.loadAll();
    this.facade.cargarTomaFisicaItems();
  }
}
