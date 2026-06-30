import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SectionTitleComponent, CardComponent } from '@restaurant/shared/ui';
import { HomeService } from '../../data-access/home.service';
import { FeaturedItem } from '../../models/home.models';

@Component({
  selector: 'restaurant-barismo-section',
  standalone: true,
  imports: [SectionTitleComponent, CardComponent, CurrencyPipe],
  templateUrl: './barismo-section.component.html',
  styleUrl: './barismo-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarismoSectionComponent implements OnInit {
  private homeService = inject(HomeService);
  items = signal<FeaturedItem[]>([]);

  ngOnInit(): void {
    this.homeService.getBarismoItems().subscribe(data => this.items.set(data));
  }
}
