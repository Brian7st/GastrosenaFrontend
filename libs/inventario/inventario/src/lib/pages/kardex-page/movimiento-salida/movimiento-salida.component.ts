import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';
import { Requisicion } from '../../../models/requisicion.model';
import { SalidaMovimientoData } from '../../../models/movimiento.model';

/**
 * Registro de salida de inventario.
 * REGLA DE NEGOCIO: toda salida debe estar vinculada a una Requisición DESPACHADA.
 * requisicionId e instructorId se auto-rellenan al seleccionar la requisición.
 * Pendiente backend B-02/B-03: cuando el backend exponga items en RequisicionResponse,
 * la tabla de ítems pre-llenará productoId y cantidad automáticamente.
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
  private fb                    = inject(FormBuilder);
  private router                = inject(Router);
  readonly kardexFacade         = inject(KardexFacade);
  readonly requisicionesFacade  = inject(RequisicionesFacade);

  // Requisiciones en estado DESPACHADA (habilitadas para generar salida)
  requisicionesDespachadas = computed(() =>
    this.requisicionesFacade.requisiciones().filter(r => r.estado === 'DESPACHADA')
  );

  requisicionSeleccionada = computed<Requisicion | null>(() => {
    const id = this.salidaForm.get('requisicionId')?.value;
    if (!id) return null;
    return this.requisicionesDespachadas().find(r => r.id === id) ?? null;
  });

  salidaForm: FormGroup = this.fb.group({
    // Auto-rellenados al seleccionar la requisición
    requisicionId: ['', Validators.required],
    instructorId:  ['', Validators.required],
    // Ingresados manualmente (pendiente B-02: vendrán pre-llenados desde los items)
    productoId:    ['', Validators.required],
    cantidad:      [null, [Validators.required, Validators.min(1)]],
    categoria:     ['', Validators.required],
  });

  constructor() {
    // Carga solo requisiciones DESPACHADA al abrir el modal
    this.requisicionesFacade.cargarPorEstado('DESPACHADA');
  }

  onRequisicionChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    const req = this.requisicionesDespachadas().find(r => r.id === id);
    if (req) {
      this.salidaForm.patchValue({
        requisicionId: req.id,
        instructorId:  req.instructorId,
      });
    } else {
      this.salidaForm.patchValue({ requisicionId: '', instructorId: '' });
    }
  }

  onSubmit(): void {
    if (this.salidaForm.invalid) return;

    const payload: SalidaMovimientoData = {
      productoId:    this.salidaForm.get('productoId')!.value,
      cantidad:      this.salidaForm.get('cantidad')!.value,
      requisicionId: this.salidaForm.get('requisicionId')!.value,
      instructorId:  this.salidaForm.get('instructorId')!.value,
      categoria:     this.salidaForm.get('categoria')!.value,
    };

    this.kardexFacade.registrarSalida(payload);
    this.closeModal();
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
