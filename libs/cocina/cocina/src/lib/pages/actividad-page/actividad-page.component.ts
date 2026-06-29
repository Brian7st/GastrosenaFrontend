import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
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
  protected readonly i18n = inject(I18nService);
  private router = inject(Router);
  private facade = inject(CocinaFacade);

  fecha = signal<string>('');
  nombreActividad = signal<string>('');
  jornada = signal<string>('');
  numeroFicha = signal<string>('');
  pasosActividad = signal<string>('');
  trimestre = signal<string>('trimestre1');

  readonly historialReciente = computed(() => [
    { nombre: 'Matemáticas', estado: this.i18n.t('actividad.aprobado'), clase: 'badge-aprobado' },
    { nombre: 'Lógica', estado: this.i18n.t('actividad.pendiente'), clase: 'badge-pendiente' },
    { nombre: 'Inglés I', estado: this.i18n.t('actividad.aprobado'), clase: 'badge-aprobado' },
  ]);

  readonly jornadas = computed(() => [
    { value: 'diurna', label: this.i18n.t('actividad.jornada_diurna') },
    { value: 'mixta', label: this.i18n.t('actividad.jornada_mixta') },
    { value: 'nocturna', label: this.i18n.t('actividad.jornada_nocturna') },
  ]);

  readonly trimestres = computed(() => [
    { value: 'trimestre1', label: this.i18n.t('actividad.trimestre_1') },
    { value: 'trimestre2', label: this.i18n.t('actividad.trimestre_2') },
    { value: 'trimestre3', label: this.i18n.t('actividad.trimestre_3') },
    { value: 'trimestre4', label: this.i18n.t('actividad.trimestre_4') },
    { value: 'trimestre5', label: this.i18n.t('actividad.trimestre_5') },
    { value: 'trimestre6', label: this.i18n.t('actividad.trimestre_6') },
    { value: 'trimestre7', label: this.i18n.t('actividad.trimestre_7') },
  ]);

  get esFormularioValido(): boolean {
    const isYearValid = () => {
      if (!this.fecha()) return false;
      const year = new Date(this.fecha()).getFullYear();
      return year >= 2020 && year <= 2050;
    };

    return (
      this.nombreActividad().trim().length > 0 &&
      this.jornada().trim().length > 0 &&
      this.numeroFicha().trim().length > 0 &&
      this.trimestre().trim().length > 0 &&
      isYearValid()
    );
  }

  crearActividad(): void {

    const jornadaLabel =
      this.jornadas().find(j => j.value === this.jornada())?.label ??
      this.jornada();

    const trimestreLabel =
      this.trimestres().find(t => t.value === this.trimestre())?.label ??
      this.trimestre();

    this.facade.crearActividad({
      nombre: this.nombreActividad() || this.i18n.t('actividad.sin_nombre'),
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