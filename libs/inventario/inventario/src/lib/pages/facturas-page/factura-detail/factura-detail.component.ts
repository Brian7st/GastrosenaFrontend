import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonComponent, DataTableComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { FacturasFacade } from '../../../data-access/facturas.facade';

@Component({
  selector: 'restaurant-factura-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, DataTableComponent, BackButtonComponent],
  templateUrl: './factura-detail.component.html',
  styleUrl: './factura-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaDetailPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facade = inject(FacturasFacade);

  factura = this.facade.facturaSeleccionada;
  loading = this.facade.loading;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarFactura(id);
    }
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/facturas']);
  }

  onVerGil(gilId: string): void {
    this.router.navigate(['/app/inventario/facturas/gil', gilId]);
  }
}
