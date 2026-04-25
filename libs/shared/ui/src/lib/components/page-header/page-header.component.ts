import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'restaurant-page-header',
  standalone: true,
  imports: [NgIf],
  template: `
    <header class="page-header">
      <div>
        <h1 class="page-header__title">{{ title }}</h1>
        <p class="page-header__subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
    </header>
  `,
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
}
