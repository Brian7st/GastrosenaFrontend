import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SectionTitleComponent } from '@restaurant/shared/ui';
import { CardComponent }         from '@restaurant/shared/ui';
import { HomeService }           from '../../data-access/home.service';
import { FeaturedItem }          from '../../models/home.models';

@Component({
  selector: 'restaurant-gastronomy-section',
  standalone: true,
  imports: [SectionTitleComponent, CardComponent],
  templateUrl: './gastronomy-section.component.html',
  styleUrl: './gastronomy-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GastronomySectionComponent implements OnInit {
  private homeService = inject(HomeService);
  items = signal<FeaturedItem[]>([]);

  ngOnInit(): void {
    this.homeService.getGastronomyItems().subscribe(data => this.items.set(data));
  }
}
