import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienKpis } from '../../../models/inventario.model';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-bien-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bien-kpi-cards.component.html',
  styleUrl: './bien-kpi-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienKpiCardsComponent {
  protected readonly i18n = inject(I18nService);
  @Input({ required: true }) kpis!: BienKpis;
}
