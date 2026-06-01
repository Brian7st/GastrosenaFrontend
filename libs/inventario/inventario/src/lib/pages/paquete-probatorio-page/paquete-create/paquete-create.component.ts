import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { PaqueteFacade } from '../../../data-access/paquete.facade';

@Component({
  selector: 'restaurant-paquete-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LucideIconComponent, ButtonComponent, BackButtonComponent],
  templateUrl: './paquete-create.component.html',
  styleUrl: './paquete-create.component.scss',
})
export class PaqueteCreateComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private fb     = inject(FormBuilder);
  private facade = inject(PaqueteFacade);

  // ── Params desde la URL ─────────────────────────────────────────────────
  actaIdParam        = signal('');
  requisicionIdParam = signal('');

  // ── Formulario ──────────────────────────────────────────────────────────
  createForm = this.fb.nonNullable.group({
    titulo:       ['', Validators.required],
    fichaId:      ['', Validators.required],
    instructorId: ['', Validators.required],
  });

  // ── Estado del Stepper ──────────────────────────────────────────────────
  currentStep = signal<number>(1);

  // ── Lifecycle ──────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.actaIdParam.set(this.route.snapshot.queryParamMap.get('actaId') ?? '');
    this.requisicionIdParam.set(this.route.snapshot.queryParamMap.get('requisicionId') ?? '');
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
      this.facade.crearPaquete({
        ...this.createForm.getRawValue(),
        actaId:        this.actaIdParam(),
        requisicionId: this.requisicionIdParam(),
      });
      this.volver();
    }
  }
}
