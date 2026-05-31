import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, DataTableComponent, ConfirmDialogComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';
import { GenerarGilData } from '../../../models/solicitudes-gil.model';
import { GIL_DEFAULTS } from '../../../util/gil-defaults.config';

interface SolicitudRow {
  id: string;
  fichaId: string;
  instructorId: string;
  totalItems: number;
  estado: string;
}

@Component({
  selector: 'app-solicitudes-generar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, DataTableComponent, ConfirmDialogComponent, BackButtonComponent],
  templateUrl: './solicitudes-generar.component.html',
  styleUrls: ['./solicitudes-generar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesGenerarComponent implements OnInit {

  private router = inject(Router);
  private facade = inject(SolicitudesFacade);

  solicitudesSesion = this.facade.solicitudesSesion;
  isSaving = this.facade.loading;

  fechaSolicitud          = signal(new Date().toISOString().split('T')[0]);
  regionalCodigo          = signal<number>(GIL_DEFAULTS.regionalCodigo);
  regionalNombre          = signal<string>(GIL_DEFAULTS.regionalNombre);
  centroCostosCodigo      = signal<number>(GIL_DEFAULTS.centroCostosCodigo);
  centroCostosNombre      = signal<string>(GIL_DEFAULTS.centroCostosNombre);
  area                    = signal<string>(GIL_DEFAULTS.area);
  destinoBienes           = signal('FORMACION');
  jefeOficinaCoordinador  = signal('');
  cuentadantes            = signal<{ nombre: string; cedula: string }[]>([]);
  mostrarNuevaCuenta      = signal(false);
  nuevaCuentaNombre       = signal('');
  nuevaCuentaCedula       = signal('');
  solicitante             = signal('');
  codigoGrupo             = signal('');
  fichaCaracterizacion    = signal('');
  observaciones           = signal('');

  solicitudes = computed<SolicitudRow[]>(() => {
    return this.solicitudesSesion().map(s => ({
      id: s.id,
      fichaId: s.fichaId,
      instructorId: s.instructorId,
      totalItems: s.items?.length ?? 0,
      estado: s.estado,
    }));
  });

  searchTerm = signal<string>('');
  selectedIds = signal<Set<string>>(new Set<string>());

  ngOnInit(): void {
    this.facade.cargarSolicitudesSesion({ estado: 'APROBADA' });
  }

  filteredSolicitudes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.solicitudes();
    return this.solicitudes().filter(s =>
      s.fichaId.toLowerCase().includes(term) ||
      s.instructorId.toLowerCase().includes(term)
    );
  });

  // KPIs
  solicitudesSeleccionadas = computed(() => this.selectedIds().size);

  requiredFieldsMissing = computed(() =>
    !this.fichaCaracterizacion().trim() ||
    !this.jefeOficinaCoordinador().trim() ||
    !this.solicitante().trim() ||
    !this.codigoGrupo().trim() ||
    this.cuentadantes().length === 0
  );

  canGenerar = computed(() => this.selectedIds().size > 0 && !this.requiredFieldsMissing());
  
  itemsTotalesConsolidar = computed(() => {
    let total = 0;
    const ids = this.selectedIds();
    for (const s of this.solicitudes()) {
      if (ids.has(s.id)) {
        total += s.totalItems ?? 0;
      }
    }
    return total;
  });

  showModal = signal<boolean>(false);

  goBack(): void {
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

  toggleSelection(id: string): void {
    const row = this.solicitudes().find(s => s.id === id);
    // Safety net: only APROBADA rows may be selected (backend filters, but guard UI too)
    if (row && !this.isAprobada(row.estado)) return;
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
    const data: GenerarGilData = {
      solicitudSesionIds:     Array.from(this.selectedIds()),
      fechaSolicitud:         this.fechaSolicitud(),
      regionalCodigo:         this.regionalCodigo(),
      regionalNombre:         this.regionalNombre(),
      centroCostosCodigo:     this.centroCostosCodigo(),
      centroCostosNombre:     this.centroCostosNombre(),
      area:                   this.area(),
      destinoBienes:          this.destinoBienes(),
      jefeOficinaCoordinador: this.jefeOficinaCoordinador(),
      cuentadantes:           this.cuentadantes(),
      solicitante:            this.solicitante(),
      codigoGrupo:            this.codigoGrupo(),
      fichaCaracterizacion:   this.fichaCaracterizacion(),
    };
    this.showModal.set(false);
    this.facade.generarGils(data).subscribe({
      next: gil => {
        if (gil !== null) {
          this.router.navigate(['/app/inventario/solicitudes-gil']);
        }
      },
      error: () => {
        // Error is already set in the facade's _error signal; expose it to the user via facade.error()
      },
    });
  }

  cerrarModal(): void {
    this.showModal.set(false);
  }

  onToggleNuevaCuenta(): void {
    this.mostrarNuevaCuenta.update(v => !v);
    if (!this.mostrarNuevaCuenta()) {
      this.nuevaCuentaNombre.set('');
      this.nuevaCuentaCedula.set('');
    }
  }

  onConfirmarCuentadante(): void {
    const nombre = this.nuevaCuentaNombre().trim();
    const cedula = this.nuevaCuentaCedula().trim();
    if (!nombre || !cedula) return;
    this.cuentadantes.update(list => [...list, { nombre, cedula }]);
    this.mostrarNuevaCuenta.set(false);
    this.nuevaCuentaNombre.set('');
    this.nuevaCuentaCedula.set('');
  }

  onRemoveCuentadante(index: number): void {
    this.cuentadantes.update(list => list.filter((_, i) => i !== index));
  }
}
