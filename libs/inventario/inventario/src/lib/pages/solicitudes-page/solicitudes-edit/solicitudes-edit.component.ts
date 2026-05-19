import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { BienSolicitud, BIENES_SOLICITUD_MOCK } from '../../../models/solicitudes-gil.mock';

@Component({
  selector: 'restaurant-solicitudes-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, BackButtonComponent],
  templateUrl: './solicitudes-edit.component.html',
  styleUrl: './solicitudes-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesEditComponent implements OnInit {
  
  solicitudId = signal<string>('GIL-2023-0892');
  isBlocked = signal<boolean>(false);
  
  bienes = signal<BienSolicitud[]>([...BIENES_SOLICITUD_MOCK]);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
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
    // TODO: llamar a solicitudesFacade.actualizarSolicitud(id, dto) cuando exista la facade
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
