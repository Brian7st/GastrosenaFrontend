import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'restaurant-bar-page',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './bar-page.component.html',
  styleUrls: ['./bar-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarPageComponent {}
