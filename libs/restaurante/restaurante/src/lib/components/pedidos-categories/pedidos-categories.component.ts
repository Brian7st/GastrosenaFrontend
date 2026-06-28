import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { CategoriaMenu } from '../../models/restaurante.model';

@Component({
  selector: 'lib-pedidos-categories',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './pedidos-categories.component.html',
  styleUrls: ['./pedidos-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosCategoriesComponent {
  @Input() categories: CategoriaMenu[] = [];
  
  @Output() filterChanged = new EventEmitter<{main: string, sub: string}>();

  activeMainCategory = signal<string>('all');
  activeSubCategory = signal<string>('all');

  // Propiedad computada para obtener las subcategorías según la categoría principal activa
  currentSubcategories = computed(() => {
    const main = this.activeMainCategory();
    if (main === 'all') return [];
    return this.categories.filter(c => c.type === main);
  });

  selectMain(mainId: string) {
    this.activeMainCategory.set(mainId);
    this.activeSubCategory.set('all'); // Resetear subcategoría al cambiar la principal
    this.emitFilter();
  }

  selectSub(subId: string) {
    this.activeSubCategory.set(subId);
    this.emitFilter();
  }

  private emitFilter() {
    this.filterChanged.emit({
      main: this.activeMainCategory(),
      sub: this.activeSubCategory()
    });
  }
}
