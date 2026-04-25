import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'restaurant-data-table',
  standalone: true,
  imports: [NgFor],
  template: `
    <table class="data-table">
      <thead>
        <tr>
          <th *ngFor="let column of columns">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of rows">
          <td *ngFor="let column of columns">{{ row[column] ?? '—' }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  @Input() columns: string[] = [];
  @Input() rows: Array<Record<string, unknown>> = [];
}
