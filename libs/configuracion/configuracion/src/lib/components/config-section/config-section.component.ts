import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-config-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideIconComponent],
  templateUrl: './config-section.component.html',
  styleUrl: './config-section.component.scss',
})
export class ConfigSectionComponent {
  readonly titulo = input.required<string>();
  readonly subtitulo = input<string>('');
  readonly icono = input<string>('settings');
  readonly expanded = input(true);
  readonly guardando = input(false);

  readonly toggleSection = output<void>();
}
