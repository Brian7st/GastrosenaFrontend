import { Component, inject, ChangeDetectionStrategy, computed, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { GilesFacade } from '../../../data-access/giles.facade';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { MovimientosService } from '../../../data-access/services/movimientos.service';
import { BienGilResponse } from '../../../data-access/api/procurement.api';
import { EntradaMovimientoData } from '../../../models/movimiento.model';

@Component({
  selector: 'restaurant-movimiento-entrada-gil',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-entrada-gil.component.html',
  styleUrl: './movimiento-entrada-gil.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientoEntradaGilComponent {
  private fb                 = inject(FormBuilder);
  private router             = inject(Router);
  private movimientosService = inject(MovimientosService);
  readonly gilesFacade       = inject(GilesFacade);
  readonly kardexFacade      = inject(KardexFacade);

  // ── Estado del selector ───────────────────────────────────────────────────
  gilIdSeleccionado = signal<string>('');
  submitError       = signal<string | null>(null);
  submitting        = signal<boolean>(false);

  // ── FormArray: un FormGroup por bien ──────────────────────────────────────
  bienesForm = signal<FormArray>(this.fb.array([]));

  // ── Computed ──────────────────────────────────────────────────────────────
  gilSeleccionado = computed(() => this.gilesFacade.gilSeleccionado());
  bienesActuales  = computed(() => this.gilSeleccionado()?.bienes ?? []);
  puedeRegistrar  = computed(() =>
    this.gilIdSeleccionado() !== '' &&
    this.bienesActuales().length > 0 &&
    this.bienesForm().valid &&
    !this.submitting()
  );

  constructor() {
    this.gilesFacade.cargarGilesValidados();

    // Reconstruye el FormArray cada vez que cambia el GIL seleccionado
    effect(() => {
      this.reconstruirFormArray(this.bienesActuales());
    });
  }

  // ── Handlers ─────────────────────────────────────────────────────────────

  onGilChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.gilIdSeleccionado.set(id);
    // Cargamos por ID para garantizar que bienes esté completo
    // (el endpoint de lista puede omitir subarrays por rendimiento)
    this.gilesFacade.cargarGilById(id);
  }

  onSubmit(): void {
    if (!this.puedeRegistrar()) return;

    const gil = this.gilSeleccionado();
    if (!gil?.id) return;

    const bienes = this.bienesActuales();
    const entradas: EntradaMovimientoData[] = [];

    for (let i = 0; i < bienes.length; i++) {
      const bien = bienes[i];
      // Skip items missing productoId — sending an empty string would be rejected by the backend.
      if (!bien.productoId) continue;
      const grupo = this.getBienGroup(i);
      if (!grupo.valid) continue;
      const cantidadRecibida: number = grupo.get('cantidadRecibida')?.value ?? 0;
      if (cantidadRecibida <= 0) continue;
      entradas.push({
        productoId:     bien.productoId,
        cantidad:       cantidadRecibida,
        precioUnitario: grupo.get('precioUnitario')?.value ?? 0,
        gilId:          gil.id,
      });
    }

    if (entradas.length === 0) {
      this.submitError.set('Ingresá al menos una cantidad recibida mayor a cero.');
      return;
    }

    this.submitError.set(null);
    this.submitting.set(true);

    const gilId = gil.id;

    forkJoin(entradas.map(e => this.movimientosService.registrarEntrada(e)))
      .pipe(
        switchMap(() => {
          const todosRecibidos = bienes.every((bien, i) => {
            const cantidadRecibida: number =
              this.getBienGroup(i).get('cantidadRecibida')?.value ?? 0;
            return cantidadRecibida >= (bien.cantidad ?? 0);
          });

          return todosRecibidos
            ? this.gilesFacade.cerrarGil(gilId)
            : of(undefined as void);
        }),
      )
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.closeModal();
        },
        error: (err: unknown) => {
          this.submitting.set(false);
          const msg = err instanceof Error ? err.message : 'Error al registrar la entrada.';
          this.submitError.set(msg);
        },
      });
  }

  closeModal(): void {
    this.gilesFacade.limpiarSeleccion();
    this.router.navigate(['/app/inventario/movimientos']);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  getBienGroup(index: number): FormGroup {
    return this.bienesForm().at(index) as FormGroup;
  }

  private reconstruirFormArray(bienes: BienGilResponse[]): void {
    const grupos = bienes.map(bien =>
      this.fb.group({
        cantidadRecibida: [
          bien.cantidad ?? 0,
          [Validators.required, Validators.min(0), Validators.max(bien.cantidad ?? 9999)],
        ],
        precioUnitario: [
          bien.valorUnitario ?? 0,
          [Validators.required, Validators.min(0)],
        ],
      })
    );
    this.bienesForm.set(this.fb.array(grupos));
  }
}
