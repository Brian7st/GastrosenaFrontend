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
import { WizardStep } from '../../../models/acta.model';

interface Firmante {
  nombre: string;
  rol: string;
  estado: 'pendiente' | 'firmado';
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
  styleUrl: './actas-create.component.scss',
})
export class ActasCreateComponent {
  private router = inject(Router);

  // ── Stepper ────────────────────────────────────────────────────────────
  currentStep = signal(1);
  readonly totalSteps = 4;

  readonly steps: WizardStep[] = [
    { number: 1, label: 'Apertura' },
    { number: 2, label: 'Desarrollo' },
    { number: 3, label: 'Firmantes' },
    { number: 4, label: 'Cierre' },
  ];

  stepProgress = computed(() => {
    const progress = ((this.currentStep() - 1) / (this.totalSteps - 1)) * 100;
    return `${progress}%`;
  });

  // ── Firmantes ──────────────────────────────────────────────────────────
  firmantes = signal<Firmante[]>([
    { nombre: 'Sebastián Betancourt', rol: 'Instructor Cuentadante', estado: 'pendiente' },
    { nombre: 'Camila Rodríguez M.', rol: 'Vocero de Aprendices', estado: 'pendiente' },
  ]);

  addFirmante(): void {
    this.firmantes.update(list => [
      ...list,
      { nombre: 'Nuevo Firmante', rol: 'Sin asignar', estado: 'pendiente' },
    ]);
  }

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
