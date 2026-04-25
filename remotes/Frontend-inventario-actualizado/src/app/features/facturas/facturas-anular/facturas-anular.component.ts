import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-facturas-anular',
    imports: [CommonModule, RouterModule, FormsModule, LucideIconComponent],
    templateUrl: './facturas-anular.component.html',
    styleUrls: ['./facturas-anular.component.scss']
})
export class FacturasAnularComponent {
  motivo = signal('');
  
  // mock info
  factura = {
    numero: 'FEL-2023-00492',
    fecha: '24 Oct, 2023',
    cliente: 'Suministros Globales S.A.',
    nit: '992031-4',
    monto: 12450.00
  };

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  }

  isMotivoValid(): boolean {
    return this.motivo().length >= 20;
  }

  confirmar() {
    if (this.isMotivoValid()) {
      console.log('Anulando...', this.motivo());
    }
  }
}
