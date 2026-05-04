import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'restaurant-data-table',
  standalone: true,
  imports: [],
  template: `
    <div class="dt-card">
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
}
