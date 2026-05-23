import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { PaqueteFacade } from '../../../data-access/paquete.facade';

@Component({
  selector: 'restaurant-paquete-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, LucideIconComponent, ButtonComponent, BackButtonComponent],
  templateUrl: './paquete-create.component.html',
  styleUrl: './paquete-create.component.scss',
})
export class PaqueteCreateComponent {
  private router = inject(Router);
  private fb     = inject(FormBuilder);
  private facade = inject(PaqueteFacade);

  // ── Formulario ──────────────────────────────────────────────────────────
  createForm = this.fb.nonNullable.group({
    expediente:   [this.generarIdExpediente(), Validators.required],
    titulo:       ['', Validators.required],
    fichaId:      ['', Validators.required],
    gilId:        [''],
    instructorId: ['', Validators.required],
  });

  // ── Estado del Stepper ──────────────────────────────────────────────────
  currentStep = signal<number>(1);

  // ── Helpers ─────────────────────────────────────────────────────────────
  private generarIdExpediente(): string {
    const año = new Date().getFullYear();
    const seq = String(Math.floor(Math.random() * 9000) + 1000);
    return `EXP-${año}-${seq}`;
  }

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
