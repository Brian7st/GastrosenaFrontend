import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'restaurant-section-title',
  standalone: true,
  imports: [],
  template: `
    <div class="section-title" [class]="'align-' + align()">
      <h2 class="section-title__heading">{{ title() }}</h2>
      @if (subtitle()) {
        <p class="section-title__subtitle">{{ subtitle() }}</p>
      }
    </div>
  `,
  styleUrl: './section-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent {
  title    = input.required<string>();
  subtitle = input<string>('');
  align    = input<'left' | 'center' | 'right'>('center');
}
