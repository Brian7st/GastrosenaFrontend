import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-movimiento-salida',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-salida.component.html',
  styleUrl: './movimiento-salida.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovimientoSalidaComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  stockDisponible = signal<number>(0); // TODO: actualizar al seleccionar producto desde la facade.

  salidaForm: FormGroup = this.fb.group({
    producto: ['', Validators.required],
    cantidad: [null, [Validators.required, Validators.min(1)]],
    fecha: ['', Validators.required],
    areaDestino: ['', Validators.required],
    instructor: [''],
    ficha: ['', [Validators.pattern('^[0-9]{7}$')]],
    categoria: ['', Validators.required],
    proposito: ['', Validators.required],
    observaciones: ['']
  });

  onSubmit(): void {
    if (this.salidaForm.valid) {
      // TODO: llamar a kardexFacade.registrarSalida(this.salidaForm.getRawValue())
      this.closeModal();
    }
  }

  closeModal() {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
