import { Component, inject, ChangeDetectionStrategy, computed, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { GilesFacade } from '../../../data-access/giles.facade';
import { KardexFacade } from '../../../data-access/kardex.facade';
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
  private fb            = inject(FormBuilder);
  private router        = inject(Router);
  readonly gilesFacade  = inject(GilesFacade);
  readonly kardexFacade = inject(KardexFacade);

  // ── Estado del selector ───────────────────────────────────────────────────
  gilIdSeleccionado = signal<string>('');

  // ── Computed ──────────────────────────────────────────────────────────────
  gilSeleccionado = computed(() => this.gilesFacade.gilSeleccionado());
  bienesActuales  = computed(() => this.gilSeleccionado()?.bienes ?? []);
  puedeRegistrar  = computed(() =>
    this.gilIdSeleccionado() !== '' &&
    this.bienesActuales().length > 0 &&
    this.bienesForm.valid &&
    !this.kardexFacade.loading()
  );

  // ── FormArray: un FormGroup por bien ──────────────────────────────────────
  bienesForm: FormArray = this.fb.array([]);

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

    this.bienesActuales().forEach((bien, i) => {
      const grupo = this.getBienGroup(i);
      if (!grupo.valid) return;

      const cantidadRecibida: number = grupo.get('cantidadRecibida')?.value ?? 0;
      if (cantidadRecibida <= 0) return;

      const entrada: EntradaMovimientoData = {
        productoId:     bien.productoId ?? '',
        cantidad:       cantidadRecibida,
        precioUnitario: grupo.get('precioUnitario')?.value ?? 0,
        gilId:          gil.id,
      };

      this.kardexFacade.registrarEntrada(entrada);
    });

    this.closeModal();
  }

  closeModal(): void {
    this.gilesFacade.limpiarSeleccion();
    this.router.navigate(['/app/inventario/movimientos']);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  getBienGroup(index: number): FormGroup {
    return this.bienesForm.at(index) as FormGroup;
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
    this.bienesForm = this.fb.array(grupos);
  }
}
