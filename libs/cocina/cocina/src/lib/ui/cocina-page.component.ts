import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeaderComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-cocina-page',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './cocina-page.component.html',
  styleUrl: './cocina-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CocinaPageComponent {}
