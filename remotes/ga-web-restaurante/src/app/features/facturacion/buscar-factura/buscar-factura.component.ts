import { Component } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar-factura',
  standalone: true,
  imports: [],
  templateUrl: './buscar-factura.component.html',
  styleUrls: ['./buscar-factura.component.scss']
})
export class BuscarFacturaComponent {
  // Variables para el flujo del Modal
  mostrarModalDetalle = false;
  facturaSeleccionada: any = null;

  constructor(private router: Router) {}

  volver() {
    this.router.navigate(['/facturacion']);
  }

  // Función para abrir el detalle
  verDetalle(factura: any) {
    this.facturaSeleccionada = factura;
    this.mostrarModalDetalle = true;
  }

  cerrarModal() {
    this.mostrarModalDetalle = false;
    this.facturaSeleccionada = null;
  }

  // Navegación final al flujo de pago
  irAPagar() {
    this.cerrarModal();
    this.router.navigate(['/facturacion/registrar-pago']);
  }
}