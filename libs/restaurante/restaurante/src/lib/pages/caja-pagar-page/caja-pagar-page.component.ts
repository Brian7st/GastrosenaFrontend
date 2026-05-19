import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  PageHeaderComponent, 
  CardComponent, 
  ButtonComponent,
  LucideIconComponent
} from '@restaurant/shared/ui';

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
export class CajaPagarPageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mostrarModalDetalle = signal(false);
  mostrarModalCobro = signal(false);
  mostrarModalExito = signal(false);
  
  metodoSeleccionado = signal('Efectivo');

  mesaSeleccionada = signal<any>({
    id: 'INV-2024-002',
    nombre: 'Mesa 5',
    cliente: 'Juan Pérez',
    mesero: 'María González',
    hora: '20:48:00',
    productos: [
      { nombre: 'Hamburguesa Doble', cantidad: 1, precio: 25000 },
      { nombre: 'Jugo de Mora', cantidad: 1, precio: 7000 }
    ],
    subtotal: 32000,
    iva: 6080,
    total: 38080
  });

  volver() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  verDetalle() {
    this.mostrarModalDetalle.set(true);
  }

  abrirCobro() {
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
    console.log(`Pago registrado con ${this.metodoSeleccionado()} para ${this.mesaSeleccionada().id}`);
    this.mostrarModalCobro.set(false);
    this.mostrarModalExito.set(true);
  }

  finalizarTodo() {
    this.cerrarModales();
    this.volver();
  }
}
