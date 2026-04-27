import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SectionTitleComponent, CardComponent } from '@restaurant/shared/ui';
import { HomeService }           from '../../data-access/home.service';
import { FeaturedItem }          from '../../models/home.models';

@Component({
  selector: 'restaurant-desserts-section',
  standalone: true,
  imports: [SectionTitleComponent, CardComponent],
  templateUrl: './desserts-section.component.html',
  styleUrl: './desserts-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DessertsSectionComponent implements OnInit {
  private homeService = inject(HomeService);
  items = signal<FeaturedItem[]>([]);

  ngOnInit(): void {
    this.homeService.getDesserts().subscribe(data => this.items.set(data));
  }
}
