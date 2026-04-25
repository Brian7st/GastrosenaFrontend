import { Component } from '@angular/core';

import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.scss'
})
export class FacturacionComponent {
  
  constructor(private router: Router) {}

  irANuevaFactura() {
    this.router.navigate(['/facturacion/nueva']);
  }

  irABuscar() {
    this.router.navigate(['/facturacion/buscar']);
  }

  // ESTA ES LA QUE TE FALTABA:
  irARegistrarPago() {
    this.router.navigate(['/facturacion/registrar-pago']);
  }
}