import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { AjusteMovimientoData } from '../../../models/movimiento.model';

/**
 * Canal controlado para correcciones de stock que no provienen de una factura FEL.
 * Casos de uso: mermas, devoluciones, ajustes por conteo físico, carga inicial.
 * Las entradas de compra DEBEN ingresar mediante el flujo de conciliación FEL.
 */
@Component({
  selector: 'restaurant-movimiento-ajuste',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-ajuste.component.html',
  styleUrl: './movimiento-ajuste.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientoAjusteComponent {
  private fb     = inject(FormBuilder);
  private router = inject(Router);
  readonly facade = inject(KardexFacade);

  readonly successMessage = signal<string | null>(null);

  readonly ajusteForm: FormGroup = this.fb.group({
    productoId:    ['', Validators.required],
    cantidadNueva: [null, [Validators.required, Validators.min(0)]],
    motivo:        ['', [Validators.required, Validators.minLength(1)]],
    autorizado:    [true],
  });

  onSubmit(): void {
    if (this.ajusteForm.invalid) {
      this.ajusteForm.markAllAsTouched();
      return;
    }

    const raw = this.ajusteForm.getRawValue() as {
      productoId: string;
      cantidadNueva: number;
      motivo: string;
      autorizado: boolean;
    };

    const payload: AjusteMovimientoData = {
      producto:      raw.productoId,
      cantidadNueva: raw.cantidadNueva,
      motivo:        raw.motivo,
      autorizado:    raw.autorizado,
      referenciaId:  null,
    };

    this.facade.registrarAjuste(payload);
    this.successMessage.set('Ajuste registrado correctamente.');
    setTimeout(() => this.successMessage.set(null), 4000);
    this.ajusteForm.reset({ autorizado: true });
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
