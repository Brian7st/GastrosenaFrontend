import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { BienSolicitud } from '../../../models/solicitudes-gil.mock';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';

@Component({
  selector: 'restaurant-solicitudes-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, BackButtonComponent],
  templateUrl: './solicitudes-form.component.html',
  styleUrl: './solicitudes-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesFormComponent {
  private router = inject(Router);
  private facade = inject(SolicitudesFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  loading = this.facade.loading;

  fechaSolicitud    = signal('2024-05-20');
  bienes            = signal<BienSolicitud[]>([]);
  mostrarNuevaCuenta = signal(false);
  nuevaCuenta       = signal('');

  onCancel(): void {
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

  onSave(): void {
    this.facade.crearSolicitud({ fecha: this.fechaSolicitud() });
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

  onAddCuentadante(): void {
    this.mostrarNuevaCuenta.update(v => !v);
    if (!this.mostrarNuevaCuenta()) {
      this.nuevaCuenta.set('');
    }
  }

  onConfirmarCuentadante(): void {
    this.mostrarNuevaCuenta.set(false);
    this.nuevaCuenta.set('');
  }

  onAddBien(): void {
    this.bienes.update(items => [
      ...items,
      {
        codigo: 'ALM-' + String(items.length + 1).padStart(3, '0'),
        descripcion: 'Nuevo Bien',
        um: 'Und',
        cantidad: 1,
        valorUnitario: 0,
        subtotal: 0
      }
    ]);
  }

  onRemoveBien(index: number): void {
    this.bienes.update(items => items.filter((_, i) => i !== index));
  }
}
