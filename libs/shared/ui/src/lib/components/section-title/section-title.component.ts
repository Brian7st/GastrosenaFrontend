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
  styles: [`
    .section-title {
      margin-bottom: 2.5rem;
      &.align-center { text-align: center; }
      &.align-left   { text-align: left; }
      &.align-right  { text-align: right; }
    }
    .section-title__heading  { font-size: 1.875rem; font-weight: 700; margin-bottom: 0.5rem; }
    .section-title__subtitle { color: #64748b; line-height: 1.7; max-width: 42rem; margin: 0 auto; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent {
  title    = input.required<string>();
  subtitle = input<string>('');
  align    = input<'left' | 'center' | 'right'>('center');
}
