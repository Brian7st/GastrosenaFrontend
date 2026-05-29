import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { ConfirmarEnvioSolicitudModalComponent } from '../../../components/confirmar-envio-solicitud-modal/confirmar-envio-solicitud-modal.component';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { SolicitudSesionItem } from '../../../models/solicitud-sesion.model';
import { Bien } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-solicitudes-insumos-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, BackButtonComponent, ConfirmarEnvioSolicitudModalComponent],
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
    }
    this.inventario.cargarBienes({ page: 0, size: 8 });
  }

  // ── Handlers del catálogo ──────────────────────────────────────────────────
  onAbrirSelectorBien(): void {
    this.mostrarSelectorBien.set(true);
    this.inventario.cargarBienes({ page: 0, size: 8 });
  }

  onBuscarBienCatalogo(term: string): void {
    this.inventario.cargarBienes({ busqueda: term, page: 0, size: 8 });
  }

  onSelectorIrAPagina(page: number): void {
    this.inventario.irAPagina(page);
  }

  estaEnLista(id: string | number): boolean {
    const bien = this.inventario.bienes().find(b => b.id === id);
    return bien ? this.items().some(i => i.codigoSena === bien.codigoSena) : false;
  }

  onSeleccionarBien(bien: Bien): void {
    const yaAgregado = this.items().some(i => i.codigoSena === bien.codigoSena);
    if (yaAgregado) return;

    this.items.update(list => [...list, {
      codigoSena:              bien.codigoSena ?? '',
      nombreBien:              bien.nombre,
      descripcion:             bien.descripcion ?? '',
      unidadMedida:            bien.unidadMedida,
      cantidad:                1,
      valorUnitario:           bien.valor ?? 0,
      valorUnitarioAdjudicado: bien.valor ?? 0,
      total:                   bien.valor ?? 0,
      iva:                     0,
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
    this.facade.crearSolicitudSesion({
      fechaSolicitud:           this.fechaSolicitud(),
      fichaId:                  this.fichaId(),
      programaId:               this.programaId(),
      instructorId:             this.instructorId(),
      identificacionInstructor: this.identificacionInstructor() || undefined,
      valorTotalDeSolicitud:    this.valorTotalDeSolicitud(),
      items:                    this.items(),
    }).subscribe(res => {
      if (res !== null) {
        this.router.navigate(['/app/inventario/solicitudes-insumos-page']);
      }
    });
  }
}
