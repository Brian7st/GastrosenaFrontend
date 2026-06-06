import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'restaurant-data-table',
  standalone: true,
  imports: [LucideIconComponent],
  template: `
    <div class="dt-card">

      <!-- Controles bakeados: ícono + título + buscador + filtros -->
      @if (tableTitle) {
        <div class="dt-controls">
          <div class="dt-controls__title">
            @if (tableIcon) {
              <lucide-icon [name]="tableIcon" [size]="22" class="dt-controls__icon"></lucide-icon>
            }
            <h3 class="dt-controls__heading">{{ tableTitle }}</h3>
          </div>
          <div class="dt-controls__actions">
            @if (searchPlaceholder) {
              <div class="dt-search">
                <lucide-icon name="search" [size]="18" class="dt-search__icon"></lucide-icon>
                <input
                  type="text"
                  class="dt-search__input"
                  [placeholder]="searchPlaceholder"
                  (input)="onSearch($event)"
                />
              </div>
            }
            @if (showFilterButton) {
              <button
                type="button"
                class="dt-filter-btn"
                [class.dt-filter-btn--active]="filterActive"
                (click)="filterToggle.emit()"
              >
                <lucide-icon name="list-filter" [size]="16"></lucide-icon>
                Filtros
                @if (filterCount > 0) {
                  <span class="dt-filter-btn__badge">{{ filterCount }}</span>
                }
              </button>
            }
            <ng-content select="[dtActions]"></ng-content>
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
  /** Muestra el botón "Filtros" baked. Oculto por defecto para no dejar botones decorativos sin función. */
  @Input() showFilterButton = false;
  /** Resalta el botón cuando el panel de filtros está abierto. */
  @Input() filterActive = false;
  /** Cantidad de filtros activos; si es > 0 se muestra un badge sobre el botón. */
  @Input() filterCount = 0;
  @Output() searchChange = new EventEmitter<string>();
  @Output() filterToggle = new EventEmitter<void>();

  onSearch(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
