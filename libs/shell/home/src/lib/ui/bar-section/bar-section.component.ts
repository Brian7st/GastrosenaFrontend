import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SectionTitleComponent, CardComponent } from '@restaurant/shared/ui';
import { HomeService }           from '../../data-access/home.service';
import { FeaturedItem }          from '../../models/home.models';

@Component({
  selector: 'restaurant-bar-section',
  standalone: true,
  imports: [SectionTitleComponent, CardComponent],
  templateUrl: './bar-section.component.html',
  styleUrl: './bar-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarSectionComponent implements OnInit {
  private homeService = inject(HomeService);
  items = signal<FeaturedItem[]>([]);

  ngOnInit(): void {
    this.homeService.getBarItems().subscribe(data => this.items.set(data));
  }
}
