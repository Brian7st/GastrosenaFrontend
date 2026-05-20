import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent, ButtonComponent, KpiCardComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { TomaFisicaItem } from '../../../models/conciliacion.model';
import { TOMA_FISICA_ITEMS_MOCK } from '../../../models/conciliacion.mock';

@Component({
  selector: 'restaurant-conciliacion-toma-fisica',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucideIconComponent,
    ButtonComponent,
    KpiCardComponent,
    BackButtonComponent,
  ],
  templateUrl: './conciliacion-toma-fisica.component.html',
  styleUrl: './conciliacion-toma-fisica.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionTomaFisicaComponent {
  // TODO: obtener desde conciliacionFacade o desde el usuario autenticado
  fecha = signal('24 Oct 2023');
  responsable = signal('Chef Instructor');

  items = signal<TomaFisicaItem[]>([...TOMA_FISICA_ITEMS_MOCK]);

  // Computed stats
  itemsTotales = computed(() => this.items().length);
  pendientesCount = computed(() => this.items().filter(i => i.conteoFisico === null).length);

  private location = inject(Location);

  goBack() {
    this.location.back();
  }

  itemsContados = computed(() => 
    this.items().filter(item => item.conteoFisico !== null).length
  );

  diferenciasCount = computed(() => 
    this.items().filter(item => item.conteoFisico !== null && item.conteoFisico !== item.stockSistema).length
  );

  precision = computed(() => {
    if (this.itemsContados() === 0) return 100;
    const itemsExactos = this.itemsContados() - this.diferenciasCount();
    return Math.round((itemsExactos / this.itemsContados()) * 100);
  });

  impactoFinanciero = computed(() => {
    return this.items().reduce((acc, item) => {
      if (item.conteoFisico === null) return acc;
      const dif = item.conteoFisico - item.stockSistema;
      return acc + (dif * item.valorUnitario);
    }, 0);
  });

  // Helpers
  getDiferencia(item: TomaFisicaItem): number | null {
    if (item.conteoFisico === null) return null;
    return item.conteoFisico - item.stockSistema;
  }

  getImpactoTotal(item: TomaFisicaItem): number | null {
    const dif = this.getDiferencia(item);
    if (dif === null) return null;
    return dif * item.valorUnitario;
  }

  // Update handler for reactivity
  updateConteoFisico(id: string, value: number | null) {
    this.items.update(items => 
      items.map(item => item.id === id ? { ...item, conteoFisico: value } : item)
    );
  }

  // UI Formatters
  formatCurrency(value: number | null): string {
    if (value === null) return '-';
    if (value === 0) return '$0';
    const signo = value < 0 ? '-' : '+';
    const formatted = new Intl.NumberFormat('es-CO').format(Math.abs(value));
    return `${signo}$${formatted}`;
  }
}
