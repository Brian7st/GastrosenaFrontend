import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'restaurant-search-filter',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label class="search-filter">
      <span class="search-filter__label">{{ label }}</span>
      <input
        class="search-filter__input"
        [placeholder]="placeholder"
        [(ngModel)]="value"
        (ngModelChange)="valueChange.emit($event)"
      />
    </label>
  `,
  styleUrl: './search-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilterComponent {
  @Input() label = 'Buscar';
  @Input() placeholder = 'Escribí para filtrar';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
}
