import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

export interface SelectFilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'restaurant-select-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  template: `
    <label class="select-filter">
      <span class="select-filter__label">{{ label }}</span>
      <div class="select-filter__wrapper">
        <select
          class="select-filter__control"
          [ngModel]="value"
          (ngModelChange)="valueChange.emit($event)"
        >
          <option *ngFor="let option of options" [value]="option.value">{{ option.label }}</option>
        </select>
        <lucide-icon name="chevron-down" [size]="16" class="select-filter__icon"></lucide-icon>
      </div>
    </label>
  `,
  styleUrl: './select-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFilterComponent {
  @Input() label = 'Filtrar';
  @Input() value = '';
  @Input() options: SelectFilterOption[] = [];
  @Output() valueChange = new EventEmitter<string>();
}
