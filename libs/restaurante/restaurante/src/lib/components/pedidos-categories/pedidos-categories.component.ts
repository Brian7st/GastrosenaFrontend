import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
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
  
  @Output() categorySelected = new EventEmitter<string>();

  activeCategory = signal<string>('all');

  selectCategory(id: string) {
    this.activeCategory.set(id);
    this.categorySelected.emit(id);
  }
}
