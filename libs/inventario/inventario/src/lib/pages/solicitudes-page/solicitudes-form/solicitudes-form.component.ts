import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { BienSolicitud, GenerarGilData } from '../../../models/solicitudes-gil.model';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { Bien } from '../../../models/inventario.model';
import { GIL_DEFAULTS } from '../../../util/gil-defaults.config';

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
  private router           = inject(Router);
  private facade           = inject(SolicitudesFacade);
  private inventarioFacade = inject(InventarioFacade);

  // ── Opciones de dominio ──────────────────────────────────────────────────
  readonly AREAS = ['Centro de Comercio y Turismo', 'Escuela de Gastronomía'];
  readonly DESTINOS = [
    { value: 'FORMACION',   label: 'Formación'    },
    { value: 'LABORATORIO', label: 'Laboratorio'  },
    { value: 'AULA',        label: 'Aula'         },
    { value: 'OTRO',        label: 'Otro'         },
  ];

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

  // ── Signals de campos del formulario (alineados con CrearGilHttpRequest) ─
  // Los campos institucionales se pre-llenan con los valores del centro SENA Quindío.
  fechaSolicitud          = signal(new Date().toISOString().split('T')[0]);
  regionalCodigo          = signal<number | null>(GIL_DEFAULTS.regionalCodigo);
  regionalNombre          = signal(GIL_DEFAULTS.regionalNombre);
  centroCostosCodigo      = signal<number | null>(GIL_DEFAULTS.centroCostosCodigo);
  centroCostosNombre      = signal(GIL_DEFAULTS.centroCostosNombre);
  area                    = signal(GIL_DEFAULTS.area);
  destinoBienes           = signal('FORMACION');
  jefeOficinaCoordinador  = signal('');
  solicitante             = signal('');
  codigoGrupo             = signal('');
  fichaCaracterizacion    = signal('');
  observaciones           = signal('');

  // ── Cuentadantes ─────────────────────────────────────────────────────────
  cuentadantes        = signal<{ nombre: string; cedula: string }[]>([]);
  mostrarNuevaCuenta  = signal(false);
  nuevaCuenta         = signal('');
  nuevaCuentaCedula   = signal('');

  // ── Bienes ───────────────────────────────────────────────────────────────
  bienes = signal<BienSolicitud[]>([]);

  // ── Validación ────────────────────────────────────────────────────────────
  private readonly FICHA_REGEX = /^\d{7}$/;
  submitAttempted = signal(false);

  errores = computed<Record<string, string>>(() => {
    const e: Record<string, string> = {};
    if (!this.fechaSolicitud().trim())
      e['fechaSolicitud'] = 'La fecha de solicitud es requerida.';
    if (this.regionalCodigo() === null)
      e['regionalCodigo'] = 'El código de regional es requerido.';
    if (!this.regionalNombre().trim())
      e['regionalNombre'] = 'El nombre de la regional es requerido.';
    if (this.centroCostosCodigo() === null)
      e['centroCostosCodigo'] = 'El código del centro de costos es requerido.';
    if (!this.centroCostosNombre().trim())
      e['centroCostosNombre'] = 'El nombre del centro de costos es requerido.';
    if (!this.area().trim())
      e['area'] = 'El área es requerida.';
    if (!this.destinoBienes().trim())
      e['destinoBienes'] = 'El destino de bienes es requerido.';
    if (!this.jefeOficinaCoordinador().trim())
      e['jefeOficinaCoordinador'] = 'El jefe de oficina / coordinador es requerido.';
    if (!this.solicitante().trim())
      e['solicitante'] = 'El solicitante es requerido.';
    if (!this.codigoGrupo().trim())
      e['codigoGrupo'] = 'El código de grupo es requerido.';
    if (!this.fichaCaracterizacion().trim()) {
      e['fichaCaracterizacion'] = 'La ficha de caracterización es requerida.';
    } else if (!this.FICHA_REGEX.test(this.fichaCaracterizacion())) {
      e['fichaCaracterizacion'] = 'La ficha debe contener exactamente 7 dígitos.';
    }
    if (this.cuentadantes().length === 0)
      e['cuentadantes'] = 'Debe agregar al menos un cuentadante.';
    if (this.bienes().length === 0)
      e['bienes'] = 'Debe agregar al menos un bien.';
    return e;
  });

  formularioValido = computed(() => Object.keys(this.errores()).length === 0);

  // ── Consolidación (Generar GIL) ───────────────────────────────────────────
  solicitudesReales = this.facade.solicitudes;

  solicitudes = computed<SolicitudRow[]>(() =>
    this.solicitudesReales().map(s => ({
      id:          String(s.id),
      codigoFicha: `${s.numeroGil}\n${s.fichaCaracterizacion}`,
      solicitante: s.cuentadantes[0]?.nombre ?? '',
      totalBienes: s.bienes?.length ?? 0,
      estado:      s.estado,
    }))
  );

  searchTerm  = signal<string>('');
  selectedIds = signal<Set<string>>(new Set<string>());
  showModal   = signal<boolean>(false);

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

  solicitudesSeleccionadas  = computed(() => this.selectedIds().size);
  itemsTotalesConsolidar    = computed(() => {
    const ids = this.selectedIds();
    return this.solicitudes()
      .filter(s => ids.has(s.id))
      .reduce((acc, s) => acc + (s.totalBienes ?? 0), 0);
  });

  // ── Handlers de consolidación ─────────────────────────────────────────────
  toggleSelection(id: string): void {
    const current = new Set(this.selectedIds());
    if (current.has(id)) { current.delete(id); } else { current.add(id); }
    this.selectedIds.set(current);
  }

  isSelected(id: string): boolean { return this.selectedIds().has(id); }

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
      regionalCodigo:         this.regionalCodigo() ?? 0,
      regionalNombre:         this.regionalNombre(),
      centroCostosCodigo:     this.centroCostosCodigo() ?? 0,
      centroCostosNombre:     this.centroCostosNombre(),
      area:                   this.area(),
      destinoBienes:          this.destinoBienes(),
      jefeOficinaCoordinador: this.jefeOficinaCoordinador(),
      cuentadantes:           this.cuentadantes(),
      solicitante:            this.solicitante(),
      codigoGrupo:            this.codigoGrupo(),
      fichaCaracterizacion:   this.fichaCaracterizacion(),
      observaciones:          this.observaciones() || undefined,
    };
    this.facade.generarGils(data);
    this.showModal.set(false);
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

  cerrarModal(): void { this.showModal.set(false); }

  // ── Handlers de cuentadantes ──────────────────────────────────────────────
  onAddCuentadante(): void {
    this.mostrarNuevaCuenta.update(v => !v);
    if (!this.mostrarNuevaCuenta()) {
      this.nuevaCuenta.set('');
      this.nuevaCuentaCedula.set('');
    }
  }

  onConfirmarCuentadante(): void {
    const nombre = this.nuevaCuenta().trim();
    const cedula = this.nuevaCuentaCedula().trim();
    if (!nombre || !cedula) return;
    this.cuentadantes.update(list => [...list, { nombre, cedula }]);
    this.mostrarNuevaCuenta.set(false);
    this.nuevaCuenta.set('');
    this.nuevaCuentaCedula.set('');
  }

  onRemoveCuentadante(index: number): void {
    this.cuentadantes.update(list => list.filter((_, i) => i !== index));
  }

  // ── Handlers del catálogo de bienes ──────────────────────────────────────
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
        codigoSena:    bien.codigoSena ?? '',
        descripcion:   bien.nombre,
        unidadMedida:  bien.unidadMedida,
        cantidad:      1,
        valorUnitario: bien.valor ?? 0,
        subtotal:      bien.valor ?? 0,
      },
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

  // ── Acciones principales ─────────────────────────────────────────────────
  onCancel(): void {
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

  onSave(): void {
    this.submitAttempted.set(true);
    if (!this.formularioValido()) return;

    this.facade.crearSolicitud({
      fechaSolicitud:         this.fechaSolicitud(),
      regionalCodigo:         this.regionalCodigo()!,
      regionalNombre:         this.regionalNombre(),
      centroCostosCodigo:     this.centroCostosCodigo()!,
      centroCostosNombre:     this.centroCostosNombre(),
      area:                   this.area(),
      destinoBienes:          this.destinoBienes(),
      jefeOficinaCoordinador: this.jefeOficinaCoordinador(),
      cuentadantes:           this.cuentadantes(),
      solicitante:            this.solicitante(),
      codigoGrupo:            this.codigoGrupo(),
      fichaCaracterizacion:   this.fichaCaracterizacion(),
      bienes:                 this.bienes(),
      observaciones:          this.observaciones() || undefined,
    });

    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }
}
