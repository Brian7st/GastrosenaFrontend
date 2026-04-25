import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [],
  templateUrl: './section-title.html',
  styleUrl: './section-title.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent {
  title  = input.required<string>();
  subtitle = input<string>('');
  align  = input<'left' | 'center' | 'right'>('center');
}
