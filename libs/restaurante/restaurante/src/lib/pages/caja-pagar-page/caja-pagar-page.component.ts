import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  PageHeaderComponent, 
  CardComponent, 
  ButtonComponent,
  LucideIconComponent
} from '@restaurant/shared/ui';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { PedidoResumenResponse } from '../../models/restaurante.model';

@Component({
  selector: 'restaurant-caja-pagar-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    LucideIconComponent
  ],
  templateUrl: './caja-pagar-page.component.html',
  styleUrl: './caja-pagar-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaPagarPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facade = inject(RestauranteFacade);

  mostrarModalDetalle = signal(false);
  mostrarModalCobro = signal(false);
  mostrarModalExito = signal(false);
  
  metodoSeleccionado = signal('Efectivo');
  mesaSeleccionada = signal<PedidoResumenResponse | null>(null);

  mesasPorPagar = this.facade.pedidosParaCobro;

  ngOnInit() {
    this.facade.cargarPedidosParaCobro();
  }

  volver() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  verDetalle(mesa: PedidoResumenResponse) {
    this.mesaSeleccionada.set(mesa);
    this.mostrarModalDetalle.set(true);
  }

  abrirCobro(mesa?: PedidoResumenResponse) {
    if (mesa) this.mesaSeleccionada.set(mesa);
    this.mostrarModalDetalle.set(false);
    this.mostrarModalCobro.set(true);
  }

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado.set(metodo);
  }

  cerrarModales() {
    this.mostrarModalDetalle.set(false);
    this.mostrarModalCobro.set(false);
    this.mostrarModalExito.set(false);
  }

  confirmarPago() {
    const mesa = this.mesaSeleccionada();
    if (mesa) {
      this.facade.procesarPagoFinal(mesa.id, this.metodoSeleccionado());
      this.mostrarModalCobro.set(false);
      this.mostrarModalExito.set(true);
    }
  }

  finalizarTodo() {
    this.cerrarModales();
    this.facade.cargarPedidosParaCobro();
    this.volver();
  }
}

