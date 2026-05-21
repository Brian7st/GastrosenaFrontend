import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { BarFacade } from '../../data-access/bar.facade';

@Component({
  selector: 'restaurant-bar-actividad-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  templateUrl: './actividad-page.component.html',
  styleUrl: './actividad-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActividadPageComponent {

  private router = inject(Router);
  private facade = inject(BarFacade);

  fecha = signal<string>('');
  nombreActividad = signal<string>('');
  jornada = signal<string>('');
  numeroFicha = signal<string>('');
  pasosActividad = signal<string>('');
  trimestre = signal<string>('trimestre1');

  readonly historialReciente = [
    { nombre: 'Servicio de Bar', estado: 'Aprobado', clase: 'badge-aprobado' },
    { nombre: 'Coctelería Básica', estado: 'Pendiente', clase: 'badge-pendiente' },
    { nombre: 'Barismo I', estado: 'Aprobado', clase: 'badge-aprobado' },
  ];

  readonly jornadas = [
    { value: 'diurna', label: 'Diurna' },
    { value: 'mixta', label: 'Mixta' },
    { value: 'nocturna', label: 'Nocturna' },
  ];

  readonly trimestres = [
    { value: 'trimestre1', label: 'Trimestre 1' },
    { value: 'trimestre2', label: 'Trimestre 2' },
    { value: 'trimestre3', label: 'Trimestre 3' },
    { value: 'trimestre4', label: 'Trimestre 4' },
  ];

  crearActividad(): void {

    const jornadaLabel =
      this.jornadas.find(j => j.value === this.jornada())?.label ??
      this.jornada();

    const trimestreLabel =
      this.trimestres.find(t => t.value === this.trimestre())?.label ??
      this.trimestre();

    this.facade.crearActividad({
      nombre: this.nombreActividad() || 'Actividad sin nombre',
      fecha: this.fecha() || new Date().toISOString().slice(0, 10),
      jornada: jornadaLabel,
      ficha: this.numeroFicha() || '0000000',
      trimestre: trimestreLabel,
    });

    this.router.navigate(['/app/bar/evaluacion-masiva']);
  }

  verActividades(): void {
    this.router.navigate(['/app/bar/actividades']);
  }
}
