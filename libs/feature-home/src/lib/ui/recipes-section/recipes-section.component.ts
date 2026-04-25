import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SectionTitleComponent } from '@restaurant/shared/ui';
import { CardComponent }         from '@restaurant/shared/ui';
import { HomeService }           from '../../data-access/home.service';
import { FeaturedItem }          from '../../models/home.models';

@Component({
  selector: 'restaurant-recipes-section',
  standalone: true,
  imports: [SectionTitleComponent, CardComponent],
  templateUrl: './recipes-section.component.html',
  styleUrl: './recipes-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesSectionComponent implements OnInit {
  private homeService = inject(HomeService);
  items = signal<FeaturedItem[]>([]);

  ngOnInit(): void {
    this.homeService.getRecipes().subscribe(data => this.items.set(data));
  }
}
