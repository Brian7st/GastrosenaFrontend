import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent, DataTableComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { GilItem, GIL_ITEMS_MOCK } from '../../../models/consolidado.model';

@Component({
  selector: 'restaurant-consolidado-create',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DataTableComponent, StatusBadgeComponent, BackButtonComponent],
  templateUrl: './consolidado-create.component.html',
  styleUrl: './consolidado-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsolidadoCreateComponent {
  private router = inject(Router);
  private location = inject(Location);

  gils = signal<GilItem[]>(GIL_ITEMS_MOCK);

  subtotalNeto = computed(() => {
    return this.gils().filter(g => g.selected && g.estado === 'Disponible').reduce((acc, curr) => acc + curr.valor, 0);
  });

  ivaAcumulado = computed(() => {
    return this.subtotalNeto() * 0.19;
  });

  retencionZese = computed(() => {
    return this.subtotalNeto() * 0.00625;
  });

  totalConsolidado = computed(() => {
    return this.subtotalNeto() + this.ivaAcumulado() - this.retencionZese();
  });

  selectedCount = computed(() => {
    return this.gils().filter(g => g.selected && g.estado === 'Disponible').length;
  });

  toggleSelection(gil: GilItem): void {
    if (gil.estado !== 'Disponible') return;
    this.gils.update(items => 
      items.map(item => item.id === gil.id ? { ...item, selected: !item.selected } : item)
    );
  }

  toggleAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.gils.update(items => 
      items.map(item => item.estado === 'Disponible' ? { ...item, selected: isChecked } : item)
    );
  }

  allSelected = computed(() => {
    const disponibles = this.gils().filter(g => g.estado === 'Disponible');
    return disponibles.length > 0 && disponibles.every(g => g.selected);
  });

  goBack(): void {
    this.location.back();
  }

  confirmar(): void {
    // TODO: llamar a consolidadoFacade.generarConsolidado(this.gils().filter(g => g.selected).map(g => g.id))
    this.router.navigate(['/app/inventario/consolidado']);
  }
}
