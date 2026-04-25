import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { FeaturedItem } from '../../models/home.models';
import { SectionTitleComponent } from '../../../../shared/ui/section-title/section-title';

@Component({
  selector: 'app-desserts-section',
  standalone: true,
  imports: [SectionTitleComponent, CurrencyPipe],
  templateUrl: './desserts-section.html',
  styleUrl: './desserts-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DessertsSectionComponent implements OnInit {
  private homeService = inject(HomeService);

  items = signal<FeaturedItem[]>([]);

  ngOnInit(): void {
    this.homeService.getDesserts().subscribe(data => this.items.set(data));
  }
}
