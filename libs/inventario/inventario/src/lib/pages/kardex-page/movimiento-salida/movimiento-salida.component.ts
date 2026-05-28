import { Component, inject, ChangeDetectionStrategy, computed, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';
import { Requisicion, RequisicionItem } from '../../../models/requisicion.model';
import { SalidaMovimientoData } from '../../../models/movimiento.model';

/**
 * Registro de salida de inventario.
 * REGLA DE NEGOCIO: toda salida debe estar vinculada a una Requisición en estado ENVIADA.
 *   ENVIADA   → habilita registrar Salida (B-04).
 *   DESPACHADA → salida ya registrada, no aparece en este selector.
 * Los ítems de la requisición pre-llenan productoId, cantidad y categoria (B-02).
 */
@Component({
  selector: 'restaurant-movimiento-salida',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-salida.component.html',
  styleUrl: './movimiento-salida.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientoSalidaComponent {
  private fb                   = inject(FormBuilder);
  private router               = inject(Router);
  readonly kardexFacade        = inject(KardexFacade);
  readonly requisicionesFacade = inject(RequisicionesFacade);

  // ── Estado del selector ───────────────────────────────────────────────────
  requisicionIdSeleccionada = signal<string>('');

  // ── Computed ──────────────────────────────────────────────────────────────
  /** Solo requisiciones ENVIADA habilitan salida (B-04). */
  requisicionesEnviadas = computed(() =>
    this.requisicionesFacade.requisiciones().filter(r => r.estado === 'ENVIADA')
  );

  requisicionSeleccionada = computed<Requisicion | null>(() => {
    const id = this.requisicionIdSeleccionada();
    if (!id) return null;
    return this.requisicionesEnviadas().find(r => r.id === id) ?? null;
  });

  itemsActuales = computed(() => this.requisicionSeleccionada()?.items ?? []);

  puedeRegistrar = computed(() =>
    this.requisicionIdSeleccionada() !== '' &&
    this.itemsActuales().length > 0 &&
    this.itemsForm.valid &&
    !this.kardexFacade.loading()
  );

  // ── FormArray: un FormGroup por ítem ──────────────────────────────────────
  itemsForm: FormArray = this.fb.array([]);

  constructor() {
    // Carga solo requisiciones ENVIADA al abrir el modal
    this.requisicionesFacade.cargarPorEstado('ENVIADA');

    // Reconstruye el FormArray cada vez que cambia la requisición seleccionada
    effect(() => {
      this.reconstruirFormArray(this.itemsActuales());
    });
  }

  // ── Handlers ─────────────────────────────────────────────────────────────

  onRequisicionChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.requisicionIdSeleccionada.set(id);
  }

  onSubmit(): void {
    if (!this.puedeRegistrar()) return;

    const req = this.requisicionSeleccionada();
    if (!req?.id) return;

    this.itemsActuales().forEach((item, i) => {
      const grupo = this.getItemGroup(i);
      if (!grupo.valid) return;

      const cantidad: number = grupo.get('cantidad')?.value ?? 0;
      if (cantidad <= 0) return;

      const payload: SalidaMovimientoData = {
        productoId:    item.productoId,
        cantidad,
        requisicionId: req.id,
        instructorId:  req.instructorId,
        categoria:     grupo.get('categoria')?.value ?? item.categoria,
      };

      this.kardexFacade.registrarSalida(payload);
    });

    this.closeModal();
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/movimientos']);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  getItemGroup(index: number): FormGroup {
    return this.itemsForm.at(index) as FormGroup;
  }

  private reconstruirFormArray(items: RequisicionItem[]): void {
    const grupos = items.map(item =>
      this.fb.group({
        cantidad: [
          item.cantidad,
          [Validators.required, Validators.min(1), Validators.max(item.cantidad)],
        ],
        categoria: [item.categoria, Validators.required],
      })
    );
    this.itemsForm = this.fb.array(grupos);
  }
}
