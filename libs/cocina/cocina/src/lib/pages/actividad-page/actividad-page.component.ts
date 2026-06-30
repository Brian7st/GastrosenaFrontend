import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { CocinaFacade } from '../../data-access/cocina.facade';
import { I18nService } from '../../i18n/i18n.service';

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
  protected readonly i18n = inject(I18nService);

  // ── Datos de fichas desde el facade ──────────────────────────────────────
  readonly fichas = this.facade.fichas;
  readonly fichasCargando = this.facade.fichasCargando;

  // ── Estado del buscador de fichas ─────────────────────────────────────────
  readonly fichaBusqueda = signal<string>('');   // texto escrito en el input
  readonly fichaDropdownOpen = signal<boolean>(false);
  readonly numeroFicha = signal<string>('');  // valor seleccionado/confirmado

  /** Lista filtrada según lo que escribe el usuario (solo por número de ficha) */
  readonly fichasFiltradas = computed(() => {
    const q = this.fichaBusqueda().toLowerCase().trim();
    const lista = this.fichas();
    if (!q) return lista;
    return lista.filter(f => f.numero.toLowerCase().includes(q));
  });

  // ── Resto del formulario ──────────────────────────────────────────────────
  fecha = signal<string>('');
  nombreActividad = signal<string>('');
  jornada = signal<string>('');
  pasosActividad = signal<string>('');
  trimestre = signal<string>('trimestre1');

  readonly historialReciente = [
    { nombre: 'Matemáticas', estado: 'Aprobado', clase: 'badge-aprobado' },
    { nombre: 'Lógica', estado: 'Pendiente', clase: 'badge-pendiente' },
    { nombre: 'Inglés I', estado: 'Aprobado', clase: 'badge-aprobado' },
  ];

  readonly jornadasKeys = [
    { value: 'diurna',   tKey: 'actividad.jornada_diurna'   },
    { value: 'mixta',    tKey: 'actividad.jornada_mixta'    },
    { value: 'nocturna', tKey: 'actividad.jornada_nocturna' },
  ];

  readonly trimestresKeys = [
    { value: 'trimestre1', tKey: 'actividad.trimestre_1' },
    { value: 'trimestre2', tKey: 'actividad.trimestre_2' },
    { value: 'trimestre3', tKey: 'actividad.trimestre_3' },
    { value: 'trimestre4', tKey: 'actividad.trimestre_4' },
    { value: 'trimestre5', tKey: 'actividad.trimestre_5' },
    { value: 'trimestre6', tKey: 'actividad.trimestre_6' },
    { value: 'trimestre7', tKey: 'actividad.trimestre_7' },
  ];

  // ── Validación del formulario ─────────────────────────────────────────────
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

  // ── Métodos del buscador de fichas ────────────────────────────────────────

  onFichaBusquedaInput(valor: string): void {
    this.fichaBusqueda.set(valor);
    this.numeroFicha.set('');        // limpiar selección hasta que elija de la lista
    this.fichaDropdownOpen.set(true);
  }

  abrirFichaDropdown(): void {
    this.fichaDropdownOpen.set(true);
  }

  /**
   * Cierra el dropdown cuando el input pierde el foco.
   * El timeout de 150 ms permite que el clic en una opción se procese antes de cerrar.
   */
  cerrarFichaDropdown(): void {
    setTimeout(() => this.fichaDropdownOpen.set(false), 150);
  }

  seleccionarFicha(numero: string): void {
    this.numeroFicha.set(numero);
    this.fichaBusqueda.set(numero);
    this.fichaDropdownOpen.set(false);
  }

  // ── Acciones del formulario ───────────────────────────────────────────────

  crearActividad(): void {
    const jornadaKey = this.jornadasKeys.find(j => j.value === this.jornada())?.tKey;
    const jornadaLabel = jornadaKey ? this.i18n.t(jornadaKey) : this.jornada();
    const trimestreKey = this.trimestresKeys.find(t => t.value === this.trimestre())?.tKey;
    const trimestreLabel = trimestreKey ? this.i18n.t(trimestreKey) : this.trimestre();

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
