import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'restaurant-hero-banner',
  standalone: true,
  imports: [],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroBannerComponent {}
