import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-movimiento-entrada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-entrada.component.html',
  styleUrl: './movimiento-entrada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovimientoEntradaComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  entradaForm: FormGroup = this.fb.group({
    producto: ['', Validators.required],
    cantidad: [null, [Validators.required, Validators.min(1)]],
    fecha: ['', Validators.required],
    proveedor: ['', Validators.required],
    factura: [''],
    ubicacion: ['', Validators.required],
    valorUnitario: [null, [Validators.required, Validators.min(0)]],
    observaciones: ['']
  });

  onSubmit(): void {
    if (this.entradaForm.valid) {
      // TODO: llamar a kardexFacade.registrarEntrada(this.entradaForm.getRawValue())
      this.closeModal();
    }
  }

  closeModal() {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
