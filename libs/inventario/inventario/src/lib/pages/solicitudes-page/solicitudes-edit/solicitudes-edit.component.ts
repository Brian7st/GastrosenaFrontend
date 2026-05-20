import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { BienSolicitud } from '../../../models/solicitudes-gil.mock';
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
  private route = inject(ActivatedRoute);
  private facade = inject(SolicitudesFacade);

  solicitudSeleccionada = this.facade.solicitudSeleccionada;
  isSaving = this.facade.loading;

  solicitudId = computed(() => {
    const sol = this.solicitudSeleccionada();
    return sol ? sol.codigo : 'Cargando...';
  });

  isBlocked = computed(() => {
    const sol = this.solicitudSeleccionada();
    if (!sol) return false;
    return sol.estado !== 'Borrador' && sol.estado !== 'Pendiente';
  });
  
  bienes = signal<BienSolicitud[]>([]);

  constructor() {
    // Sincronizar bienes locales cuando se carga la solicitud
    effect(() => {
      const sol = this.solicitudSeleccionada();
      if (sol && sol.bienes) {
        this.bienes.set([...sol.bienes]);
      }
    }, { allowSignalWrites: true });
  }

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
    const sol = this.solicitudSeleccionada();
    if (!sol) return;

    this.facade.actualizarSolicitud(sol.id, { 
      bienes: this.bienes(),
      totalBienes: this.bienes().length
    });

    // Navegar después de simular guardado
    setTimeout(() => {
      this.router.navigate(['/app/inventario/solicitudes-gil', sol.id]);
    }, 600);
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
