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

  // ── Datos de fichas desde el facade ──────────────────────────────────────
  readonly fichas = this.facade.fichas;
  readonly fichasCargando = this.facade.fichasCargando;

  // ── Estado del buscador de fichas ─────────────────────────────────────────
  readonly fichaBusqueda    = signal<string>('');
  readonly fichaDropdownOpen = signal<boolean>(false);
  readonly numeroFicha      = signal<string>('');

  /** Lista filtrada según lo que escribe el usuario (solo por número de ficha) */
  readonly fichasFiltradas = computed(() => {
    const q    = this.fichaBusqueda().toLowerCase().trim();
    const lista = this.fichas();
    if (!q) return lista;
    return lista.filter(f => String(f.numero).toLowerCase().includes(q));
  });

  // ── Estado de guardado ────────────────────────────────────────────────────
  readonly guardando = signal<boolean>(false);

  // ── Resto del formulario ──────────────────────────────────────────────────
  fecha            = signal<string>('');
  nombreActividad  = signal<string>('');
  jornada          = signal<string>('');
  pasosActividad   = signal<string>('');
  trimestre        = signal<string>('trimestre1');

  readonly jornadas = [
    { value: 'diurna',   label: 'Diurna'   },
    { value: 'mixta',    label: 'Mixta'    },
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
    this.numeroFicha.set('');
    this.fichaDropdownOpen.set(true);
  }

  abrirFichaDropdown(): void {
    this.fichaDropdownOpen.set(true);
  }

  cerrarFichaDropdown(): void {
    setTimeout(() => this.fichaDropdownOpen.set(false), 150);
  }

  seleccionarFicha(numero: string): void {
    const numStr = String(numero);
    this.numeroFicha.set(numStr);
    this.fichaBusqueda.set(numStr);
    this.fichaDropdownOpen.set(false);
  }

  // ── Acciones del formulario ───────────────────────────────────────────────

  crearActividad(): void {
    if (!this.esFormularioValido || this.guardando()) return;

    const jornadaLabel =
      this.jornadas.find(j => j.value === this.jornada())?.label ?? this.jornada();
    const trimestreLabel =
      this.trimestres.find(t => t.value === this.trimestre())?.label ?? this.trimestre();

    this.guardando.set(true);

    this.facade.crearActividad({
      nombre:    this.nombreActividad() || 'Actividad sin nombre',
      fecha:     this.fecha() || new Date().toISOString().slice(0, 10),
      jornada:   jornadaLabel,
      ficha:     this.numeroFicha() || '0000000',
      trimestre: trimestreLabel,
    }).subscribe({
      next: (actividadCreada) => {
        // Navegar con el ID real que asignó el backend
        this.router.navigate(
          ['/app/cocina/evaluacion-masiva'],
          { queryParams: { actividadId: actividadCreada.id } }
        );
      },
      error: (err) => {
        console.error('Error al crear actividad:', err);
        this.guardando.set(false);
      }
    });
  }

  verActividades(): void {
    this.router.navigate(['/app/cocina/actividades']);
  }
}
