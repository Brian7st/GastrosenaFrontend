import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { SalidaMovimientoData } from '../../../models/movimiento.model';

@Component({
  selector: 'restaurant-movimiento-salida',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-salida.component.html',
  styleUrl: './movimiento-salida.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovimientoSalidaComponent {
  private fb     = inject(FormBuilder);
  private router = inject(Router);
  private facade = inject(KardexFacade);

  /** Stock en tiempo real; se actualizará cuando el backend esté integrado */
  stockDisponible = signal<number>(0);

  salidaForm: FormGroup = this.fb.group({
    producto:      ['', Validators.required],
    cantidad:      [null, [Validators.required, Validators.min(1)]],
    fecha:         ['', Validators.required],
    areaDestino:   ['', Validators.required],
    instructor:    [''],
    ficha:         ['', [Validators.pattern('^[0-9]{7}$')]],
    categoria:     ['', Validators.required],
    proposito:     ['', Validators.required],
    observaciones: [''],
  });

  onSubmit(): void {
    if (this.salidaForm.valid) {
      this.facade.registrarSalida(this.salidaForm.getRawValue() as SalidaMovimientoData);
      this.closeModal();
    }
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
