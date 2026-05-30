import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideIconComponent, CardComponent, PageHeaderComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-pedidos-hub-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideIconComponent,
    CardComponent,
    PageHeaderComponent,
    ButtonComponent
  ],
  templateUrl: './pedidos-hub-page.component.html',
  styleUrls: ['./pedidos-hub-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosHubPageComponent {}
