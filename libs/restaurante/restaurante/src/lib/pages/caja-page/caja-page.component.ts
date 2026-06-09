import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  PageHeaderComponent, 
  KpiCardComponent, 
  ButtonComponent,
  LucideIconComponent
} from '@restaurant/shared/ui';
import { RestauranteFacade } from '../../data-access/restaurante.facade';

@Component({
  selector: 'restaurant-caja-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    KpiCardComponent,
    ButtonComponent,
    LucideIconComponent,
    CurrencyPipe
  ],
  templateUrl: './caja-page.component.html',
  styleUrl: './caja-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  facade = inject(RestauranteFacade);

  ngOnInit() {
    this.facade.cargarPedidosParaCobro();
    this.facade.cargarHistorialFacturas();
  }

  irANuevaFactura() {
    this.router.navigate(['./nueva'], { relativeTo: this.route });
  }

  irABuscar() {
    this.router.navigate(['./buscar'], { relativeTo: this.route });
  }

  irARegistrarPago() {
    if (!this.facade.isCajaAbierta()) return;
    this.router.navigate(['./pagar'], { relativeTo: this.route });
  }

  irAApertura() {
    this.router.navigate(['./apertura'], { relativeTo: this.route });
  }

  irACierre() {
    if (!this.facade.isCajaAbierta()) return;
    this.router.navigate(['./cierre'], { relativeTo: this.route });
  }

  irAMovimientos() {
    if (!this.facade.isCajaAbierta()) return;
    this.router.navigate(['./movimientos'], { relativeTo: this.route });
  }
}