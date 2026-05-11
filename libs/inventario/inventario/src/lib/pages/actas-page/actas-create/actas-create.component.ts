import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  StatusBadgeComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';

interface WizardStep {
  number: number;
  label: string;
}

@Component({
  selector: 'restaurant-actas-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    StatusBadgeComponent,
    LucideIconComponent,
  ],
  templateUrl: './actas-create.component.html',
  styleUrls: ['./actas-create.component.scss'],
})
export class ActasCreateComponent {
  private router = inject(Router);

  // ── Stepper ────────────────────────────────────────────────────────────
  currentStep = signal(1);
  readonly totalSteps = 4;

  steps: WizardStep[] = [
    { number: 1, label: 'Apertura' },
    { number: 2, label: 'Desarrollo' },
    { number: 3, label: 'Firmantes' },
    { number: 4, label: 'Cierre' },
  ];

  stepProgress = computed(() => {
    const progress = ((this.currentStep() - 1) / (this.totalSteps - 1)) * 100;
    return `${progress}%`;
  });

  // ── Navegación del wizard ──────────────────────────────────────────────
  nextStep(): void {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  generarActa(): void {
    // Placeholder: navega al listado tras generar
    this.router.navigate(['/app/inventario/actas']);
  }
}
