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

@Component({
  selector: 'restaurant-paquete-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, LucideIconComponent],
  templateUrl: './paquete-create.component.html',
  styleUrls: ['./paquete-create.component.scss'],
})
export class PaqueteCreateComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // ── Formulario ──────────────────────────────────────────────────────────
  createForm = this.fb.nonNullable.group({
    expediente: ['PKT-2026-021', Validators.required], // Auto-generado idealmente
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
      // Simular guardado y redirección
      console.log('Guardando paquete...', this.createForm.value);
      this.volver();
    }
  }
}
