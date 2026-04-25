import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { FeaturedItem } from '../../models/home.models';
import { SectionTitleComponent } from '../../../../shared/ui/section-title/section-title';

@Component({
  selector: 'app-main-dishes-section',
  standalone: true,
  imports: [SectionTitleComponent, CurrencyPipe],
  templateUrl: './main-dishes-section.html',
  styleUrl: './main-dishes-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDishesSectionComponent implements OnInit {
  private homeService = inject(HomeService);

  items = signal<FeaturedItem[]>([]);

  ngOnInit(): void {
    this.homeService.getMainDishes().subscribe(data => this.items.set(data));
  }
}
