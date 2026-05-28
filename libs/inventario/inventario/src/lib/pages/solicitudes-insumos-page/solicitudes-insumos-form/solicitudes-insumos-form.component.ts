import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { SolicitudSesionItem } from '../../../models/solicitud-sesion.model';
import { Bien } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-solicitudes-insumos-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, BackButtonComponent],
  templateUrl: './solicitudes-insumos-form.component.html',
  styleUrl: './solicitudes-insumos-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesInsumosFormComponent implements OnInit {
  private router         = inject(Router);
  private route          = inject(ActivatedRoute);
  readonly facade        = inject(SolicitudesFacade);
  readonly inventario    = inject(InventarioFacade);

  isEdit         = signal(false);
  solicitudId    = signal<string | null>(null);
  solicitudCodigo = signal<string | null>(null);

  // ── Campos del formulario ──────────────────────────────────────────────────
  fechaSolicitud            = signal(new Date().toISOString().split('T')[0]);
  fichaId                   = signal('');
  programaId                = signal('');
  instructorId              = signal('');
  identificacionInstructor  = signal('');
  resultadoAprendizaje      = signal('');
  actividades               = signal('');
  voceroId                  = signal('');
  items                     = signal<SolicitudSesionItem[]>([]);

  valorTotalDeSolicitud = computed(() =>
    this.items().reduce((acc, i) => acc + (i.cantidad * (i.valorUnitario ?? 0)), 0)
  );

  // ── Selector del catálogo ──────────────────────────────────────────────────
  mostrarSelectorBien  = signal(false);
  catalogoBienes       = this.inventario.bienes;
  catalogoPaginacion   = this.inventario.paginacion;
  catalogoLoading      = this.inventario.loading;
  paginasSelectorBien  = computed(() =>
    Array.from({ length: this.catalogoPaginacion().totalPages }, (_, i) => i)
  );

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
    if (!this.resultadoAprendizaje().trim())
      e['resultadoAprendizaje'] = 'El resultado de aprendizaje es requerido.';
    if (!this.actividades().trim())
      e['actividades'] = 'Las actividades son requeridas.';
    if (!this.voceroId().trim())
      e['voceroId'] = 'El ID del vocero es requerido.';
    if (this.items().length === 0)
      e['items'] = 'Debe agregar al menos un ítem.';
    if (this.items().some(i => !i.justificacion.trim()))
      e['justificacion'] = 'Todos los ítems requieren justificación.';
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

  onSeleccionarBien(bien: Bien): void {
    this.items.update(list => [...list, {
      productoId:              String(bien.id),
      codigoSena:              bien.codigoSena ?? '',
      nombreBien:              bien.nombre,
      descripcion:             bien.descripcion ?? '',
      unidadMedida:            bien.unidadMedida,
      cantidad:                1,
      justificacion:           '',
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

  onJustificacionChange(index: number, justificacion: string): void {
    this.items.update(list =>
      list.map((item, i) => i === index ? { ...item, justificacion } : item)
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

    this.facade.crearSolicitudSesion({
      fechaSolicitud:            this.fechaSolicitud(),
      fichaId:                   this.fichaId(),
      programaId:                this.programaId(),
      instructorId:              this.instructorId(),
      identificacionInstructor:  this.identificacionInstructor() || undefined,
      resultadoAprendizaje:      this.resultadoAprendizaje(),
      actividades:               this.actividades(),
      voceroId:                  this.voceroId(),
      valorTotalDeSolicitud:     this.valorTotalDeSolicitud(),
      items:                     this.items(),
    });

    this.router.navigate(['/app/inventario/solicitudes-insumos-page']);
  }
}
