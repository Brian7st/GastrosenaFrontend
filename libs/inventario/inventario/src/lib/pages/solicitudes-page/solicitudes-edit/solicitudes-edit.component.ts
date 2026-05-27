import { Component, ChangeDetectionStrategy, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { BienSolicitud } from '../../../models/solicitudes-gil.model';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';

@Component({
  selector: 'restaurant-solicitudes-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, BackButtonComponent],
  templateUrl: './solicitudes-edit.component.html',
  styleUrl: './solicitudes-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesEditComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private facade = inject(SolicitudesFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  solicitud   = this.facade.solicitudSeleccionada;
  loading     = this.facade.loading;
  solicitudId = computed(() => this.solicitud()?.numeroGil ?? '');

  isBlocked   = computed(() => {
    const estado = this.solicitud()?.estado;
    return estado !== undefined && estado !== 'BORRADOR';
  });

  bienes = signal<BienSolicitud[]>([]);

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.facade.cargarSolicitudById(paramId);
    }
  }

  onCancel(): void {
    const rawId = this.route.snapshot.paramMap.get('id') || '001';
    this.router.navigate(['/app/inventario/solicitudes-gil', rawId]);
  }

  onSave(): void {
    const codigo = this.solicitud()?.numeroGil;
    if (codigo) {
      this.facade.actualizarSolicitud(codigo, {});
    }
    const rawId = this.route.snapshot.paramMap.get('id') || '001';
    this.router.navigate(['/app/inventario/solicitudes-gil', rawId]);
  }

  onAddBien(): void {
    this.bienes.update(items => [
      ...items,
      {
        codigoSena: 'ALM-' + String(items.length + 1).padStart(3, '0'),
        descripcion: 'Nuevo Bien Solicitado',
        unidadMedida: 'Und',
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
