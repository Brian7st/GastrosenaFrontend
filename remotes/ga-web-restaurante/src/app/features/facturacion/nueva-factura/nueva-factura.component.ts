import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nueva-factura',
  standalone: true,
  imports: [],
  templateUrl: './nueva-factura.component.html',
  styleUrl: './nueva-factura.component.scss'
})
export class NuevaFacturaComponent {

  constructor(private router: Router) {}

  volver() {
    this.router.navigate(['/facturacion']);
  }
}