import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'restaurant-data-table',
  standalone: true,
  imports: [],
  template: `
    <div class="dt-card">

      <!-- Controles bakeados: ícono + título + buscador + filtros -->
      @if (tableTitle) {
        <div class="dt-controls">
          <div class="dt-controls__title">
            @if (tableIcon) {
              <span class="material-symbols-outlined dt-controls__icon">{{ tableIcon }}</span>
            }
            <h3 class="dt-controls__heading">{{ tableTitle }}</h3>
          </div>
          <div class="dt-controls__actions">
            @if (searchPlaceholder) {
              <div class="dt-search">
                <span class="material-symbols-outlined dt-search__icon">search</span>
                <input
                  type="text"
                  class="dt-search__input"
                  [placeholder]="searchPlaceholder"
                  (input)="onSearch($event)"
                />
              </div>
            }
            <button class="dt-filter-btn">
              <span class="material-symbols-outlined">filter_list</span>
              Filtros
            </button>
          </div>
        </div>
      }

      <!-- Slot para header completamente custom (cuando no se usan los inputs) -->
      <ng-content select="[dtHeader]"></ng-content>

      <div class="dt-wrapper">
        <table class="dt-table">
          @if (columns.length > 0) {
            <thead>
              <tr>
                @for (col of columns; track col) {
                  <th>{{ col }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of rows; track $index) {
                <tr>
                  @for (col of columns; track col) {
                    <td>{{ row[col] ?? '—' }}</td>
                  }
                </tr>
              }
            </tbody>
          }
          <ng-content></ng-content>
        </table>
      </div>

      <ng-content select="[dtFooter]"></ng-content>
    </div>
  `,
  styleUrl: './data-table.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  @Input() columns: string[] = [];
  @Input() rows: Array<Record<string, unknown>> = [];
  @Input() tableTitle = '';
  @Input() tableIcon  = '';
  @Input() searchPlaceholder = '';
  @Output() searchChange = new EventEmitter<string>();

  onSearch(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
