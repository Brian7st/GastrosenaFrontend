import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';
import { GenerarGilData } from '../../../models/solicitudes-gil.model';
import { GIL_DEFAULTS } from '../../../util/gil-defaults.config';

interface SolicitudRow {
  id: string;
  codigoFicha: string;
  solicitante: string;
  totalBienes: number;
  estado: string;
}

@Component({
  selector: 'app-solicitudes-generar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, BackButtonComponent],
  templateUrl: './solicitudes-generar.component.html',
  styleUrls: ['./solicitudes-generar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesGenerarComponent implements OnInit {
  
  private router = inject(Router);
  private facade = inject(SolicitudesFacade);

  // Cargamos los datos reales de la API (Facade)
  solicitudesReales = this.facade.solicitudes;
  isSaving = this.facade.loading;

  // Campos del GIL resultado — pre-llenados con defaults institucionales
  fechaSolicitud          = signal(new Date().toISOString().split('T')[0]);
  regionalCodigo          = signal<number>(GIL_DEFAULTS.regionalCodigo);
  regionalNombre          = signal<string>(GIL_DEFAULTS.regionalNombre);
  centroCostosCodigo      = signal<number>(GIL_DEFAULTS.centroCostosCodigo);
  centroCostosNombre      = signal<string>(GIL_DEFAULTS.centroCostosNombre);
  area                    = signal<string>(GIL_DEFAULTS.area);
  destinoBienes           = signal('FORMACION');
  jefeOficinaCoordinador  = signal('');
  cuentadanteNombre       = signal('');
  cuentadanteCedula       = signal('');
  solicitante             = signal('');
  codigoGrupo             = signal('');
  fichaCaracterizacion    = signal('');
  observaciones           = signal('');

  // Transformamos los datos al formato visual que ya tenías
  solicitudes = computed<SolicitudRow[]>(() => {
    return this.solicitudesReales().map(s => ({
      id: String(s.id),
      codigoFicha: `${s.numeroGil}\n${s.fichaCaracterizacion}`,
      solicitante: s.cuentadantes[0]?.nombre ?? '',
      totalBienes: s.bienes?.length ?? 0,
      estado: s.estado // 'Aprobado', 'Borrador', etc.
    }));
  });
  
  // Mock data basándonos en el prototipo
  searchTerm = signal<string>('');
  selectedIds = signal<Set<string>>(new Set<string>());

  ngOnInit(): void {
    // Al entrar a la página, aseguramos que los datos estén frescos
    this.facade.loadAll();
  }

  // Solicitudes filtradas (podríamos aplicar el searchTerm aquí si lo deseamos)
  filteredSolicitudes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.solicitudes();
    return this.solicitudes().filter(s => 
      s.codigoFicha.toLowerCase().includes(term) || 
      s.solicitante.toLowerCase().includes(term)
    );
  });

  // KPIs
  solicitudesSeleccionadas = computed(() => this.selectedIds().size);

  requiredFieldsMissing = computed(() =>
    !this.fichaCaracterizacion().trim() ||
    !this.jefeOficinaCoordinador().trim() ||
    !this.solicitante().trim() ||
    !this.codigoGrupo().trim() ||
    !this.cuentadanteNombre().trim() ||
    !this.cuentadanteCedula().trim()
  );

  canGenerar = computed(() => this.selectedIds().size > 0 && !this.requiredFieldsMissing());
  
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

  showModal = signal<boolean>(false);

  goBack(): void {
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

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
      cuentadantes:           [{ nombre: this.cuentadanteNombre(), cedula: this.cuentadanteCedula() }],
      solicitante:            this.solicitante(),
      codigoGrupo:            this.codigoGrupo(),
      fichaCaracterizacion:   this.fichaCaracterizacion(),
    };
    this.facade.generarGils(data);
    this.showModal.set(false);
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

  cerrarModal(): void {
    this.showModal.set(false);
  }
}
