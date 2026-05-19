import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  PageHeaderComponent, 
  KpiCardComponent, 
  ButtonComponent,
  LucideIconComponent
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-caja-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    KpiCardComponent,
    ButtonComponent,
    LucideIconComponent
  ],
  templateUrl: './caja-page.component.html',
  styleUrl: './caja-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaPageComponent {
  private router = inject(Router);

  irANuevaFactura() {
    this.router.navigate(['/facturacion/nueva']);
  }

  irABuscar() {
    this.router.navigate(['/facturacion/buscar']);
  }

  irARegistrarPago() {
    this.router.navigate(['/facturacion/registrar-pago']);
  }
}
