import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

@Component({
  selector: 'restaurant-solicitudes-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, BackButtonComponent],
  templateUrl: './solicitudes-edit.component.html',
  styleUrl: './solicitudes-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesEditComponent {
  
  solicitudId = signal<string>('GIL-2023-0892');
  isBlocked = signal<boolean>(false);
  
  bienes = signal([
    {
      codigo: 'ALM-001',
      descripcion: 'Harina de Trigo x 50kg',
      um: 'Bto',
      cantidad: 2,
      valorUnitario: 150000,
      subtotal: 300000
    }
  ]);

  constructor(private router: Router, private route: ActivatedRoute) {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      if (paramId === 'bloqueado') {
        this.solicitudId.set(`GIL-F-014-2024-BLOQUEADO`);
        this.isBlocked.set(true);
      } else {
        this.solicitudId.set(`GIL-F-014-2024-${paramId}`);
      }
    }
  }

  onCancel(): void {
    const rawId = this.route.snapshot.paramMap.get('id') || '001';
    this.router.navigate(['/app/inventario/solicitudes-gil', rawId]);
  }

  onSave(): void {
    const rawId = this.route.snapshot.paramMap.get('id') || '001';
    this.router.navigate(['/app/inventario/solicitudes-gil', rawId]);
  }

  onAddBien(): void {
    this.bienes.update(items => [
      ...items,
      {
        codigo: 'ALM-' + String(items.length + 1).padStart(3, '0'),
        descripcion: 'Nuevo Bien Solicitado',
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
