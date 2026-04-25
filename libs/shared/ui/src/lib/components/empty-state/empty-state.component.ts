import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'restaurant-empty-state',
  standalone: true,
  template: `
    <section class="empty-state">
      <strong class="empty-state__title">{{ title }}</strong>
      <p class="empty-state__message">{{ message }}</p>
    </section>
  `,
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
}
