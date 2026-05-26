import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { BienSolicitud } from '../../../models/solicitudes-gil.mock';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';

interface SolicitudRow {
  id: string;
  codigoFicha: string;
  solicitante: string;
  totalBienes: number;
  estado: string;
}

@Component({
  selector: 'restaurant-solicitudes-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, BackButtonComponent],
  templateUrl: './solicitudes-form.component.html',
  styleUrl: './solicitudes-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesFormComponent implements OnInit {
  private router = inject(Router);
  private facade = inject(SolicitudesFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  loading = this.facade.loading;

  fechaSolicitud    = signal('2024-05-20');
  bienes            = signal<BienSolicitud[]>([]);
  mostrarNuevaCuenta = signal(false);
  nuevaCuenta       = signal('');

  // ── Datos para la Consolidación (Generar GIL) ───────────────────────────
  solicitudesReales = this.facade.solicitudes;
  
  solicitudes = computed<SolicitudRow[]>(() => {
    return this.solicitudesReales().map(s => ({
      id: String(s.id),
      codigoFicha: `${s.numeroGil}\n${s.fichaId}`,
      solicitante: s.cuentadantes[0]?.nombre ?? '',
      totalBienes: s.bienes?.length ?? 0,
      estado: s.estado
    }));
  });

  searchTerm = signal<string>('');
  selectedIds = signal<Set<string>>(new Set<string>());
  showModal = signal<boolean>(false);

  ngOnInit(): void {
    this.facade.loadAll();
  }

  filteredSolicitudes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.solicitudes();
    return this.solicitudes().filter(s => 
      s.codigoFicha.toLowerCase().includes(term) || 
      s.solicitante.toLowerCase().includes(term)
    );
  });

  solicitudesSeleccionadas = computed(() => this.selectedIds().size);
  
  itemsTotalesConsolidar = computed(() => {
    let total = 0;
    const ids = this.selectedIds();
    for (const s of this.solicitudes()) {
      if (ids.has(s.id)) {
        total += s.totalBienes ?? 0;
      }
    }
    return total;
  });

  toggleSelection(id: string): void {
    const current = new Set(this.selectedIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedIds.set(current);
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  isAprobada(estado: string): boolean {
    const e = estado.toUpperCase();
    return e === 'APROBADO' || e === 'APROBADA';
  }

  onGenerar(): void {
    if (this.selectedIds().size === 0) return;
    this.showModal.set(true);
  }

  confirmarGeneracion(): void {
    const ids = Array.from(this.selectedIds());
    this.facade.generarGils(ids);
    this.showModal.set(false);
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

  cerrarModal(): void {
    this.showModal.set(false);
  }

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
