import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { FeaturedItem } from '../../models/home.models';
import { SectionTitleComponent } from '../../../../shared/ui/section-title/section-title';
import { CardComponent } from '../../../../shared/ui/card/card';

@Component({
  selector: 'app-gastronomy-section',
  standalone: true,
  imports: [SectionTitleComponent, CardComponent],
  templateUrl: './gastronomy-section.html',
  styleUrl: './gastronomy-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GastronomySectionComponent implements OnInit {
  private homeService = inject(HomeService);

  items = signal<FeaturedItem[]>([]);

  ngOnInit(): void {
    this.homeService.getGastronomyItems().subscribe(data => this.items.set(data));
  }
}
