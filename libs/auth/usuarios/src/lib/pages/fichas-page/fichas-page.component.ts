import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  OnInit,
  inject,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  DataTableComponent,
  KpiCardComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';
import { AuthService } from '@restaurant/shared/auth';
import { Rol } from '@restaurant/shared/models';
import { FichasService } from '../../data-access/fichas.service';
import { I18nService } from '../../i18n/i18n.service';
import { Ficha } from '../../models/ficha.model';

type EstadoFiltro = 'todos' | 'activas' | 'inactivas';

@Component({
  selector: 'restaurant-fichas-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    FormsModule,
    DataTableComponent,
    KpiCardComponent,
    LucideIconComponent,
  ],
  templateUrl: './fichas-page.component.html',
  styleUrl: './fichas-page.component.scss',
})
export class FichasPageComponent implements OnInit {
  private readonly fichasService = inject(FichasService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  protected readonly i18n = inject(I18nService);

  // Crear/editar/borrar fichas: solo ADMINISTRADOR. El INSTRUCTOR solo consulta.
  readonly esAdmin = computed(() => this.auth.currentUser()?.rol === Rol.ADMINISTRADOR);

  readonly fichas = signal<Ficha[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly busqueda     = signal('');
  readonly estadoFiltro = signal<EstadoFiltro>('todos');

  readonly mostrarModal   = signal(false);
  readonly fichaEditando  = signal<Ficha | null>(null);

  readonly formNumero      = signal('');
  readonly formPrograma    = signal('');
  readonly formFechaInicio = signal('');
  readonly formFechaFin    = signal('');

  readonly fichasFiltradas = computed(() => {
    const lista  = this.fichas();
    const q      = this.busqueda().toLowerCase();
    const estado = this.estadoFiltro();
    return lista.filter(f => {
      const matchQ = !q ||
        f.numero.toLowerCase().includes(q) ||
        f.programa.toLowerCase().includes(q);
      const matchEstado =
        estado === 'todos' ||
        (estado === 'activas'   &&  f.activa) ||
        (estado === 'inactivas' && !f.activa);
      return matchQ && matchEstado;
    });
  });

  readonly totalFichas   = computed(() => this.fichas().length);
  readonly totalActivas  = computed(() => this.fichas().filter(f => f.activa).length);
  readonly totalInactivas = computed(() => this.fichas().filter(f => !f.activa).length);

  ngOnInit(): void {
    this.cargarFichas();
  }

  cargarFichas(): void {
    this.loading.set(true);
    this.fichasService.obtenerFichas().subscribe({
      next: (data) => {
        this.fichas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las fichas');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  onNuevaFicha(): void {
    this.fichaEditando.set(null);
    this.formNumero.set('');
    this.formPrograma.set('');
    this.formFechaInicio.set('');
    this.formFechaFin.set('');
    this.mostrarModal.set(true);
  }

  onEditarFicha(f: Ficha): void {
    this.fichaEditando.set(f);
    this.formNumero.set(f.numero);
    this.formPrograma.set(f.programa);
    this.formFechaInicio.set(f.fechaInicio);
    this.formFechaFin.set(f.fechaFin);
    this.mostrarModal.set(true);
  }

  onCerrarModal(): void {
    this.mostrarModal.set(false);
    this.fichaEditando.set(null);
  }

  onGuardar(): void {
    const numero      = this.formNumero().trim();
    const programa    = this.formPrograma().trim();
    const fechaInicio = this.formFechaInicio().trim();
    const fechaFin    = this.formFechaFin().trim();

    if (!numero || !programa || !fechaInicio || !fechaFin) { return; }

    const editando = this.fichaEditando();
    const nuevaFicha = { numero, programa, fechaInicio, fechaFin, activa: true };

    if (editando) {
      this.fichasService.actualizarFicha(editando.id, nuevaFicha).subscribe({
        next: () => this.cargarFichas(),
        error: (err) => console.error(err)
      });
    } else {
      this.fichasService.crearFicha(nuevaFicha).subscribe({
        next: () => this.cargarFichas(),
        error: (err) => console.error(err)
      });
    }
    this.onCerrarModal();
  }

  onEliminar(id: string): void {
    if (!confirm(this.i18n.t('fichas.confirmar_eliminar'))) { return; }
    this.fichasService.eliminarFicha(id).subscribe({
      next: () => { this.error.set(''); this.cargarFichas(); },
      error: () => this.error.set('No se puede eliminar la ficha porque tiene aprendices asignados. Primero quítalos desde el detalle de la ficha.')
    });
  }

  onVerAprendices(id: string) {
  this.router.navigate(['app/usuarios/fichas', id, 'detalle']);
}
}