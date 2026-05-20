import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  PageHeaderComponent, 
  CardComponent, 
  ButtonComponent,
  LucideIconComponent,
  StatusBadgeComponent
} from '@restaurant/shared/ui';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { PedidoResumenResponse } from '../../models/restaurante.model';

@Component({
  selector: 'restaurant-caja-buscar-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    LucideIconComponent,
    StatusBadgeComponent
  ],
  templateUrl: './caja-buscar-page.component.html',
  styleUrl: './caja-buscar-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaBuscarPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facade = inject(RestauranteFacade);

  mostrarModalDetalle = signal(false);
  facturaSeleccionada = signal<PedidoResumenResponse | null>(null);
  
  // Lista proveniente del Facade
  facturas = this.facade.historialFacturas;

  ngOnInit() {
    this.facade.cargarHistorialFacturas();
  }

  volver() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  verDetalle(factura: PedidoResumenResponse) {
    this.facturaSeleccionada.set(factura);
    this.mostrarModalDetalle.set(true);
  }

  cerrarModal() {
    this.mostrarModalDetalle.set(false);
    this.facturaSeleccionada.set(null);
  }

  irAPagar() {
    // Si llegara a estar pendiente, lo enviamos al cajero
    this.cerrarModal();
    this.router.navigate(['../pagar'], { relativeTo: this.route });
  }
}

