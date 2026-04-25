import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-factura-edit-modal',
    imports: [CommonModule, LucideIconComponent, FormsModule],
    templateUrl: './factura-edit-modal.component.html',
    styleUrls: ['./factura-edit-modal.component.scss']
})
export class FacturaEditModalComponent {
  @Output() cerrar = new EventEmitter<void>();

  constructor(private router: Router) {}

  // Mock data for the form
  articulos = [
    { cant: 10, desc: 'Suministros de Oficina Premium', precio: 100.00, total: 1000.00 },
    { cant: 2, desc: 'Servicio de Consultoría IT', precio: 120.00, total: 240.00 }
  ];

  close() {
    this.cerrar.emit();
  }

  goToAnular() {
    this.close();
    this.router.navigate(['/facturas', '1', 'anular']);
  }
}
