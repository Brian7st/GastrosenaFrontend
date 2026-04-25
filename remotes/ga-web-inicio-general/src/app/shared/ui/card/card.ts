import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  title    = input<string>('');
  subtitle = input<string>('');
  imageUrl = input<string>('');
  price    = input<number | null>(null);
}
