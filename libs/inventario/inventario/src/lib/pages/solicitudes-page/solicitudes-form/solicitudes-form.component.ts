import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { BienSolicitud } from '../../../models/solicitudes-gil.mock';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { Bien } from '../../../models/inventario.model';

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
  private router            = inject(Router);
  private facade            = inject(SolicitudesFacade);
  private inventarioFacade  = inject(InventarioFacade);

  // ── Opciones de dominio ──────────────────────────────────────────────────
  readonly AREAS = ['Centro de Comercio y Turismo', 'Escuela de Gastronomía'];

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  loading = this.facade.loading;

  // ── Selector de bienes del catálogo ─────────────────────────────────────
  mostrarSelectorBien  = signal(false);
  catalogoBienes       = this.inventarioFacade.bienes;
  catalogoPaginacion   = this.inventarioFacade.paginacion;
  catalogoLoading      = this.inventarioFacade.loading;
  paginasSelectorBien  = computed(() =>
    Array.from({ length: this.catalogoPaginacion().totalPages }, (_, i) => i)
  );

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
    this.inventarioFacade.cargarBienes({ page: 0, size: 8 });
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

  onAbrirSelectorBien(): void {
    this.mostrarSelectorBien.set(true);
    this.inventarioFacade.cargarBienes({ page: 0, size: 8 });
  }

  onBuscarBienCatalogo(term: string): void {
    this.inventarioFacade.cargarBienes({ busqueda: term, page: 0, size: 8 });
  }

  onSelectorIrAPagina(page: number): void {
    this.inventarioFacade.irAPagina(page);
  }

  onSeleccionarBien(bien: Bien): void {
    this.bienes.update(items => [
      ...items,
      {
        codigo:        bien.codigoSena ?? '',
        descripcion:   bien.nombre,
        um:            bien.unidadMedida,
        cantidad:      1,
        valorUnitario: bien.valor ?? 0,
        subtotal:      bien.valor ?? 0,
      }
    ]);
    this.mostrarSelectorBien.set(false);
  }

  onCantidadChange(index: number, cantidad: number): void {
    this.bienes.update(items =>
      items.map((item, i) =>
        i === index
          ? { ...item, cantidad, subtotal: cantidad * item.valorUnitario }
          : item
      )
    );
  }

  onRemoveBien(index: number): void {
    this.bienes.update(items => items.filter((_, i) => i !== index));
  }
}
