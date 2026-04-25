import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { FacturaElectronicaDisponible, FACTURAS_DISPONIBLES_MOCK } from '../models/solicitud-gil.model';

@Component({
    selector: 'app-solicitudes-gil-create',
    imports: [CommonModule, FormsModule, RouterModule, LucideIconComponent],
    templateUrl: './solicitudes-gil-create.component.html',
    styleUrls: ['./solicitudes-gil-create.component.scss']
})
export class SolicitudesGilCreateComponent {
  facturasDisponibles = signal<FacturaElectronicaDisponible[]>(FACTURAS_DISPONIBLES_MOCK);

  selectFactura(index: number) {
    const updated = this.facturasDisponibles().map((f, i) => ({
      ...f,
      seleccionada: i === index
    }));
    this.facturasDisponibles.set(updated);
  }

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-CO');
  }
}
