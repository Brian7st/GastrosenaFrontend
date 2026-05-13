import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent, DataTableComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

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

  ngOnInit(): void {}

  goBack(): void {
    this.router.navigate(['/app/inventario/facturas']);
  }

  onVerGil(gilId: string): void {
    this.router.navigate(['/app/inventario/facturas/gil', gilId]);
  }
}
