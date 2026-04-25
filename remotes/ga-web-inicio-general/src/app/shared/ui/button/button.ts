import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  variant  = input<'primary' | 'secondary' | 'outline'>('primary');
  size     = input<'sm' | 'md' | 'lg'>('md');
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(false);
}
