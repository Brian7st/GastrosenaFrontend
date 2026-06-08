import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { ConfirmarEnvioSolicitudModalComponent } from '../../../components/confirmar-envio-solicitud-modal/confirmar-envio-solicitud-modal.component';
import { BienTableComponent } from '../../../ui/components/bien-table/bien-table.component';
import { BienTypeaheadComponent } from '../../../ui/components/bien-typeahead/bien-typeahead.component';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { SolicitudSesionItem } from '../../../models/solicitud-sesion.model';
import { Bien } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-solicitudes-insumos-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, BackButtonComponent, ConfirmarEnvioSolicitudModalComponent, BienTableComponent, BienTypeaheadComponent],
  templateUrl: './solicitudes-insumos-form.component.html',
  styleUrl: './solicitudes-insumos-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesInsumosFormComponent implements OnInit {
  private router         = inject(Router);
  private route          = inject(ActivatedRoute);
  readonly facade        = inject(SolicitudesFacade);
  readonly inventario    = inject(InventarioFacade);

  isEdit          = signal(false);

  constructor() {
    effect(() => {
      const s = this.facade.solicitudSesionSeleccionada();
      if (s && this.isEdit()) {
        this.fichaId.set(s.fichaId);
        this.programaId.set(s.programaId);
        this.instructorId.set(s.instructorId);
        this.identificacionInstructor.set(s.identificacionInstructor ?? '');
        if (s.fechaSolicitud) this.fechaSolicitud.set(s.fechaSolicitud);
        this.items.set(s.items.map(i => ({ ...i })));
      }
    });
  }
  solicitudId     = signal<string | null>(null);
  solicitudCodigo = signal<string | null>(null);
  isModalOpen     = signal(false);

  // ── Campos del formulario ──────────────────────────────────────────────────
  fechaSolicitud           = signal(new Date().toISOString().split('T')[0]);
  fichaId                  = signal('');
  programaId               = signal('');
  instructorId             = signal('');
  identificacionInstructor = signal('');
  items                    = signal<SolicitudSesionItem[]>([]);

  valorTotalDeSolicitud = computed(() =>
    this.items().reduce((acc, i) => acc + (i.cantidad * (i.valorUnitario ?? 0)), 0)
  );

  // ── Selector del catálogo ──────────────────────────────────────────────────
  mostrarSelectorBien = signal(false);
  catalogoBienes      = this.inventario.bienes;
  catalogoPaginacion  = this.inventario.paginacion;
  catalogoLoading     = this.inventario.loading;
  paginasSelectorBien = computed(() =>
    Array.from({ length: this.catalogoPaginacion().totalPages }, (_, i) => i)
  );

  catalogoRangoInfo = computed(() => {
    const { page, size, totalElements } = this.catalogoPaginacion();
    const desde = totalElements === 0 ? 0 : page * size + 1;
    const hasta = Math.min((page + 1) * size, totalElements);
    return { desde, hasta, total: totalElements };
  });

  addedCodigosSena = computed(() => this.items().map(i => i.codigoSena));

  // ── Validación ────────────────────────────────────────────────────────────
  submitAttempted = signal(false);

  errores = computed<Record<string, string>>(() => {
    const e: Record<string, string> = {};
    if (!this.fichaId().trim())
      e['fichaId'] = 'La ficha de caracterización es requerida.';
    if (!this.programaId().trim())
      e['programaId'] = 'El programa de formación es requerido.';
    if (!this.instructorId().trim())
      e['instructorId'] = 'El ID del instructor es requerido.';
    if (this.items().length === 0)
      e['items'] = 'Debe agregar al menos un ítem.';
    return e;
  });

  formularioValido = computed(() => Object.keys(this.errores()).length === 0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.solicitudId.set(id);
      this.facade.cargarSolicitudSesionById(id);
    }
    this.inventario.cargarBienes({ estado: 'Activo', page: 0, size: 8 });
  }

  // ── Handlers del catálogo ──────────────────────────────────────────────────
  onAbrirSelectorBien(): void {
    this.mostrarSelectorBien.set(true);
    this.inventario.cargarBienes({ estado: 'Activo', page: 0, size: 8 });
  }

  onBuscarBienCatalogo(term: string): void {
    this.inventario.cargarBienes({ estado: 'Activo', busqueda: term, page: 0, size: 8 });
  }

  onSelectorIrAPagina(page: number): void {
    this.inventario.irAPagina(page);
  }

  onSeleccionarBien(bien: Bien): void {
    const yaAgregado = this.items().some(i => i.codigoSena === bien.codigoSena);
    if (yaAgregado) return;

    this.items.update(list => [...list, {
      codigoSena:              bien.codigoSena ?? '',
      nombreBien:              bien.descripcion ?? '',
      descripcion:             bien.descripcion ?? '',
      codigoAlmacen:           bien.codigoProveedor ?? '',
      unidadMedida:            bien.unidadMedida,
      cantidad:                1,
      valorUnitario:           bien.valor ?? 0,
      valorUnitarioAdjudicado: bien.valor ?? 0,
      total:                   bien.valor ?? 0,
      iva:                     bien.iva ?? 0,
    }]);
    this.mostrarSelectorBien.set(false);
  }

  onCantidadChange(index: number, cantidad: number): void {
    this.items.update(list =>
      list.map((item, i) =>
        i === index
          ? { ...item, cantidad, total: cantidad * (item.valorUnitario ?? 0) }
          : item
      )
    );
  }

  onCodigoAlmacenChange(index: number, codigoAlmacen: string): void {
    this.items.update(list =>
      list.map((item, i) => i === index ? { ...item, codigoAlmacen } : item)
    );
  }

  onIvaChange(index: number, iva: number): void {
    this.items.update(list =>
      list.map((item, i) => i === index ? { ...item, iva } : item)
    );
  }

  onRemoveItem(index: number): void {
    this.items.update(list => list.filter((_, i) => i !== index));
  }

  // ── Acciones ──────────────────────────────────────────────────────────────
  onCancel(): void {
    this.router.navigate(['/app/inventario/solicitudes-insumos-page']);
  }

  onSave(): void {
    this.submitAttempted.set(true);
    if (!this.formularioValido()) return;
    this.isModalOpen.set(true);
  }

  cerrarModalConfirmacion(): void {
    this.isModalOpen.set(false);
  }

  confirmarEnvio(): void {
    this.isModalOpen.set(false);
    const payload = {
      fechaSolicitud:           this.fechaSolicitud(),
      fichaId:                  this.fichaId(),
      programaId:               this.programaId(),
      instructorId:             this.instructorId(),
      identificacionInstructor: this.identificacionInstructor() || undefined,
      valorTotalDeSolicitud:    this.valorTotalDeSolicitud(),
      items:                    this.items(),
    };
    const id = this.solicitudId();
    const op$ = this.isEdit() && id
      ? this.facade.actualizarSolicitudSesion(id, payload)
      : this.facade.crearSolicitudSesion(payload);
    op$.subscribe(res => {
      if (res !== null) {
        this.router.navigate(['/app/inventario/solicitudes-insumos-page']);
      }
    });
  }
}
