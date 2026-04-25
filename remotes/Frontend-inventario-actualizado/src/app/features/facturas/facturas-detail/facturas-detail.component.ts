import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { FACTURA_DETALLE_MOCK, FacturaCompleta } from '../models/factura.model';
import { FacturaEditModalComponent } from '../components/factura-edit-modal/factura-edit-modal.component';

@Component({
    selector: 'app-facturas-detail',
    imports: [CommonModule, RouterModule, LucideIconComponent, FacturaEditModalComponent],
    templateUrl: './facturas-detail.component.html',
    styleUrls: ['./facturas-detail.component.scss']
})
export class FacturasDetailComponent {
  factura = signal<FacturaCompleta>(FACTURA_DETALLE_MOCK);
  showEditModal = signal(false);

  constructor(private route: ActivatedRoute, private router: Router) {}

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  }

  openEditModal() {
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  goToAnular() {
    this.router.navigate(['/facturas', this.factura().id, 'anular']);
  }
}
