import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent, LoadingSkeletonComponent } from '@restaurant/shared/ui';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { ContratosFacade } from '../../../data-access/contratos.facade';
import { BienFormComponent } from '../../../ui/modals/bien-form/bien-form.component';
import { BienImportModalComponent, BienImportPayload } from '../../modals/bien-import/bien-import.component';
import { ContratoImportModalComponent, ContratoImportPayload } from '../../modals/contrato-import/contrato-import.component';
import { Bien, BienFormDto, EstadoBien, BienFiltros } from '../../../models/inventario.model';
import { EstadoContrato } from '../../../models/contrato.model';
import { EmptyStateComponent } from '../../../components/empty-state/empty-state.component';
import { CATEGORIAS_BIEN } from '../../../models/categorias.model';

type VistaGestion = 'bienes' | 'contratos';

@Component({
  selector: 'restaurant-bienes-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    DataTableComponent,
    KpiCardComponent,
    LoadingSkeletonComponent,
    BienFormComponent,
    BienImportModalComponent,
    ContratoImportModalComponent,
    EmptyStateComponent,
  ],
  templateUrl: './bienes-list.component.html',
  styleUrl: './bienes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienesListPageComponent implements OnInit {
  private facade = inject(InventarioFacade);
  private contratosFacade = inject(ContratosFacade);
  private router = inject(Router);

  // State signals
  bienes      = this.facade.bienes;
  kpis        = this.facade.kpis;
  loading     = this.facade.loading;
  paginacion  = this.facade.paginacion;

  // ── Toggle de vistas (Bienes / Contratos) ──────────────────────────────────
  vista             = signal<VistaGestion>('bienes');
  contratos         = this.contratosFacade.contratos;
  loadingContratos  = this.contratosFacade.loading;
  ultimaImportacion = this.contratosFacade.ultimaImportacion;
  showImportContratoModal = signal(false);
  /** Carga lazy: los contratos solo se piden la primera vez que se abre la vista. */
  private contratosCargados = signal(false);

  paginas = computed(() =>
    Array.from({ length: this.paginacion().totalPages }, (_, i) => i)
  );

  readonly CATEGORIAS = CATEGORIAS_BIEN;
  showFilters     = signal(false);
  filtroCategoria = signal<string>('');
  filtroEstado    = signal<EstadoBien | ''>('');

  filtrosActivos = computed(() => {
    let count = 0;
    if (this.filtroCategoria()) count++;
    if (this.filtroEstado())    count++;
    return count;
  });

  // Modal controls
  showFormModal = signal(false);
  showImportModal = signal(false);
  formMode = signal<'create' | 'edit'>('create');
  selectedBien = signal<Bien | undefined>(undefined);

  constructor() {
    // Al importar un contrato con éxito se crean/actualizan bienes del catálogo;
    // refrescamos la lista de bienes en el acto, sin recargar la página.
    effect(() => {
      if (this.contratosFacade.ultimaImportacion()) {
        this.facade.cargarBienes();
      }
    });
  }

  ngOnInit(): void {
    this.facade.loadAll();
  }

  onToggleFilters(): void {
    this.showFilters.update(v => !v);
  }

  // ── Vistas ────────────────────────────────────────────────────────────────

  cambiarVista(vista: VistaGestion): void {
    this.vista.set(vista);
    if (vista === 'contratos' && !this.contratosCargados()) {
      this.contratosFacade.cargarContratos();
      this.contratosCargados.set(true);
    }
  }

  onCerrarContrato(id: string): void {
    this.contratosFacade.cerrarContrato(id);
  }

  onAbrirImportarContrato(): void {
    this.showImportContratoModal.set(true);
  }

  onImportarContrato(payload: ContratoImportPayload): void {
    if (payload.tipo === 'excel') {
      this.contratosFacade.importarExcel(payload.archivo, payload.cabecera);
    } else {
      this.contratosFacade.importarContrato(payload.data);
    }
    this.showImportContratoModal.set(false);
  }

  getEstadoContratoBadgeClass(estado: EstadoContrato): string {
    return estado === 'VIGENTE' ? 'estado-badge--activo' : 'estado-badge--inactivo';
  }

  onSearch(query: string): void {
    this.facade.cargarBienes({ busqueda: query });
  }

  onFiltroCategoria(value: string): void {
    this.filtroCategoria.set(value);
    const filtros: BienFiltros = {};
    if (value)                    filtros.categoria = value;
    if (this.filtroEstado())      filtros.estado    = this.filtroEstado() as EstadoBien;
    this.facade.cargarBienes(filtros);
  }

  onFiltroEstado(value: string): void {
    this.filtroEstado.set(value as EstadoBien | '');
    const filtros: BienFiltros = {};
    if (value)                      filtros.estado    = value as EstadoBien;
    if (this.filtroCategoria())     filtros.categoria = this.filtroCategoria();
    this.facade.cargarBienes(filtros);
  }

  onLimpiarFiltros(): void {
    this.filtroCategoria.set('');
    this.filtroEstado.set('');
    this.facade.cargarBienes({ categoria: undefined, estado: undefined, busqueda: undefined });
  }

  onIrAPagina(page: number): void {
    this.facade.irAPagina(page);
  }

  onImportBienes(): void {
    this.showImportModal.set(true);
  }

  onProcessImport(payload: BienImportPayload): void {
    if (payload.tipo === 'excel') {
      this.facade.importarBienesExcel(payload.archivo);
      this.showImportModal.set(false);
      return;
    }

    this.facade.importarBienes(payload.filas.map(row => ({
      codigoSena: row.codigoSena,
      descripcion: row.descripcion,
      categoria: row.categoria ?? 'General',
      unidadMedida: row.unidadMedida,
      codigoProveedor: row.codigoProveedor,
      stockMinimo: row.stockMinimo ?? null,
    })));
    this.showImportModal.set(false);
  }

  onExportBienes(): void {
    this.router.navigate(['/app/inventario/bienes/exportar']);
  }

  onNuevoBien(): void {
    this.selectedBien.set(undefined);
    this.formMode.set('create');
    this.showFormModal.set(true);
  }

  onEditar(bien: Bien): void {
    this.selectedBien.set(bien);
    this.formMode.set('edit');
    this.showFormModal.set(true);
  }

  onSaveBien(dto: BienFormDto): void {
    if (this.formMode() === 'create') {
      this.facade.crearBien(dto);
    } else {
      this.facade.actualizarBien(this.selectedBien()!.id, dto);
    }
    this.showFormModal.set(false);
  }

  onVerDetalle(bien: Bien): void {
    this.router.navigate(['/app/inventario/bienes', bien.id]);
  }

  onDesactivar(bien: Bien): void {
    this.facade.desactivarBien(bien.id);
  }

  onActivar(bien: Bien): void {
    this.facade.activarBien(bien.id);
  }

  getEstadoBadgeClass(estado: EstadoBien): string {
    const map: Record<EstadoBien, string> = {
      'Activo': 'estado-badge--activo',
      'Bajo Stock': 'estado-badge--bajo',
      'Agotado': 'estado-badge--agotado',
      'Inactivo': 'estado-badge--inactivo'
    };
    return map[estado] || '';
  }
}
