import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-actividad-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  templateUrl: './actividad-page.component.html',
  styleUrl: './actividad-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActividadPageComponent {
  fecha          = signal<string>('');
  nombreActividad = signal<string>('');
  jornada        = signal<string>('');
  numeroFicha    = signal<string>('');
  pasosActividad = signal<string>('');
  trimestre      = signal<string>('trimestre1');

  readonly historialReciente = [
    { nombre: 'Matemáticas', estado: 'Aprobado',  clase: 'badge-aprobado'  },
    { nombre: 'Lógica',      estado: 'Pendiente', clase: 'badge-pendiente' },
    { nombre: 'Inglés I',    estado: 'Aprobado',  clase: 'badge-aprobado'  },
  ];

  readonly jornadas = [
    { value: 'diurna',   label: 'Diurna' },
    { value: 'mixta',    label: 'Mixta'  },
    { value: 'nocturna', label: 'Nocturna' },
  ];

  readonly trimestres = [
    { value: 'trimestre1', label: 'Trimestre 1' },
    { value: 'trimestre2', label: 'Trimestre 2' },
    { value: 'trimestre3', label: 'Trimestre 3' },
    { value: 'trimestre4', label: 'Trimestre 4' },
  ];

  private router = inject(Router);

  crearActividad(): void {
    this.router.navigate(['/app/cocina/evaluacion-masiva']);
  }
}
