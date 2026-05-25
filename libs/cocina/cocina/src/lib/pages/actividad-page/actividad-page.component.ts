import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { CocinaFacade } from '../../data-access/cocina.facade';

@Component({
  selector: 'restaurant-actividad-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  templateUrl: './actividad-page.component.html',
  styleUrl: './actividad-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActividadPageComponent {

  private router = inject(Router);
  private facade = inject(CocinaFacade);

  fecha = signal<string>('');
  nombreActividad = signal<string>('');
  jornada = signal<string>('');
  numeroFicha = signal<string>('');
  pasosActividad = signal<string>('');
  trimestre = signal<string>('trimestre1');

  readonly historialReciente = [
    { nombre: 'Matemáticas', estado: 'Aprobado', clase: 'badge-aprobado' },
    { nombre: 'Lógica', estado: 'Pendiente', clase: 'badge-pendiente' },
    { nombre: 'Inglés I', estado: 'Aprobado', clase: 'badge-aprobado' },
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
    { value: 'trimestre5', label: 'Trimestre 5' },
    { value: 'trimestre6', label: 'Trimestre 6' },
    { value: 'trimestre7', label: 'Trimestre 7' },
  ];

  isFormValid = computed(() => {
    const f = this.fecha();
    const n = this.nombreActividad().trim();
    const j = this.jornada();
    const nf = this.numeroFicha().trim();
    const t = this.trimestre();

    if (!f || !n || !j || !nf || !t) return false;

    const year = parseInt(f.split('-')[0], 10);
    if (isNaN(year) || year < 2020 || year > 2050) return false;

    return true;
  });

  crearActividad(): void {
    if (!this.isFormValid()) return;

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

    this.router.navigate(['/app/cocina/evaluacion-masiva']);
  }

  verActividades(): void {
    this.router.navigate(['/app/cocina/actividades']);
  }
}