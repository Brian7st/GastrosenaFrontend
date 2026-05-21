import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { PaqueteFacade } from '../../../data-access/paquete.facade';

@Component({
  selector: 'restaurant-paquete-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, LucideIconComponent, BackButtonComponent],
  templateUrl: './paquete-create.component.html',
  styleUrl: './paquete-create.component.scss',
})
export class PaqueteCreateComponent {
  private router = inject(Router);
  private fb     = inject(FormBuilder);
  private facade = inject(PaqueteFacade);

  // ── Formulario ──────────────────────────────────────────────────────────
  createForm = this.fb.nonNullable.group({
    expediente: ['', Validators.required], // Auto-generado idealmente
    titulo: ['', Validators.required],
    programa: ['', Validators.required],
    ficha: ['', Validators.required],
    gilVinculado: [''],
    responsable: ['', Validators.required],
  });

  // ── Estado del Stepper ──────────────────────────────────────────────────
  currentStep = signal<number>(1);

  // ── Navegación ─────────────────────────────────────────────────────────
  volver(): void {
    this.router.navigate(['/app/inventario/paquete-probatorio']);
  }

  cancelar(): void {
    this.volver();
  }

  siguientePaso(): void {
    if (this.currentStep() === 1 && this.createForm.valid) {
      this.currentStep.set(2);
    } else {
      this.createForm.markAllAsTouched();
    }
  }

  pasoAnterior(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  guardarPaquete(): void {
    if (this.createForm.valid) {
      this.facade.crearPaquete(this.createForm.getRawValue());
      this.volver();
    }
  }
}
