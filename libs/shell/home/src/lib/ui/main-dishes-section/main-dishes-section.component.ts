import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SectionTitleComponent, CardComponent } from '@restaurant/shared/ui';
import { HomeService }           from '../../data-access/home.service';
import { FeaturedItem }          from '../../models/home.models';

@Component({
  selector: 'restaurant-main-dishes-section',
  standalone: true,
  imports: [SectionTitleComponent, CardComponent],
  templateUrl: './main-dishes-section.component.html',
  styleUrl: './main-dishes-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDishesSectionComponent implements OnInit {
  private homeService = inject(HomeService);
  items = signal<FeaturedItem[]>([]);

  ngOnInit(): void {
    this.homeService.getMainDishes().subscribe(data => this.items.set(data));
  }
}
