import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  PageHeaderComponent, 
  CardComponent, 
  ButtonComponent,
  LucideIconComponent
} from '@restaurant/shared/ui';
import { DetallePedidoRequest, PedidoCreateRequest } from '../../models/restaurante.model';
import { RestauranteService } from '../../data-access/restaurante.service';

@Component({
  selector: 'restaurant-caja-nueva-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    LucideIconComponent
  ],
  templateUrl: './caja-nueva-page.component.html',
  styleUrl: './caja-nueva-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaNuevaPageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private restauranteService = inject(RestauranteService);

  // Datos Cliente
  nombreCliente = signal('');
  documento = signal('');

  // Producto Actual
  productoActualNombre = signal('');
  productoActualPrecio = signal<number | null>(null);
  productoActualCantidad = signal(1);

  // Lista de Productos
  listaProductos = signal<DetallePedidoRequest[]>([]);

  // Totales computados
  totalFactura = computed(() => this.listaProductos().reduce((acc, p) => acc + (p.precioUnitario * p.cantidad), 0));
  ivaFactura = computed(() => this.totalFactura() * 0.19); // Opcional si se requiere desglose

  volver() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  agregarProducto() {
    const nombre = this.productoActualNombre();
    const precio = this.productoActualPrecio();
    const cant = this.productoActualCantidad();
    
    if (!nombre || !precio || cant < 1) return;

    const newItem: DetallePedidoRequest = {
      productoId: `MANUAL-${Date.now()}`,
      nombreProducto: nombre,
      precioUnitario: precio,
      cantidad: cant,
      categoria: 'OTROS'
    };

    this.listaProductos.update(lista => [...lista, newItem]);
    
    // Resetear formulario interno
    this.productoActualNombre.set('');
    this.productoActualPrecio.set(null);
    this.productoActualCantidad.set(1);
  }

  eliminarProducto(index: number) {
    this.listaProductos.update(lista => lista.filter((_, i) => i !== index));
  }

  generarFactura() {
    if (this.listaProductos().length === 0) return;
    
    const notas = `Factura Manual. Cliente: ${this.nombreCliente() || 'Consumidor Final'} - Doc: ${this.documento()}`;

    const request: PedidoCreateRequest = {
      numeroComensales: 1, // Por defecto al no haber mesa física
      notas: notas,
      detalles: this.listaProductos()
    };

    this.restauranteService.crearPedido(request).subscribe({
      next: (res) => {
        // En flujo completo, podrías mostrar un modal de éxito e imprimir
        this.volver();
      },
      error: (err) => console.error('Error generando factura manual', err)
    });
  }
}

