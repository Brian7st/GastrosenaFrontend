import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { EntradaMovimientoData } from '../../../models/movimiento.model';

/**
 * Entrada directa sin GIL — para casos excepcionales (ajustes de stock, devoluciones, etc.).
 * Las entradas desde GIL se gestionan mediante el proceso de conciliación de facturas.
 * Alineado con RegistrarEntradaHttpRequest (Swagger).
 */
@Component({
  selector: 'restaurant-movimiento-entrada',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-entrada.component.html',
  styleUrl: './movimiento-entrada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientoEntradaComponent {
  private fb     = inject(FormBuilder);
  private router = inject(Router);
  readonly facade = inject(KardexFacade);

  successMessage = signal<string | null>(null);

  entradaForm: FormGroup = this.fb.group({
    productoId:      ['', Validators.required],
    cantidad:        [null, [Validators.required, Validators.min(1)]],
    precioUnitario:  [null, [Validators.required, Validators.min(0)]],
    proveedorNit:    [''],
    facturaId:       [''],
    gilId:           [''],
    conciliacionId:  [''],
  });

  onSubmit(): void {
    if (this.entradaForm.valid) {
      this.facade.registrarEntrada(this.entradaForm.getRawValue() as EntradaMovimientoData);
      this.successMessage.set('Entrada registrada correctamente.');
      setTimeout(() => this.successMessage.set(null), 4000);
      this.entradaForm.reset();
    }
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
