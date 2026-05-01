import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { BienKpis } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-bien-kpi-cards',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './bien-kpi-cards.component.html',
  styleUrl: './bien-kpi-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienKpiCardsComponent {
  @Input({ required: true }) kpis!: BienKpis;
}
