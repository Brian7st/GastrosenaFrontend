import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DataTableComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';
import { I18nService } from '../../i18n/i18n.service';

export interface Ficha {
  readonly id:          string;
  readonly numero:      string;
  readonly programa:    string;
  readonly fechaInicio: string;
  readonly fechaFin:    string;
  readonly activa:      boolean;
}

type EstadoFiltro = 'todos' | 'activas' | 'inactivas';

@Component({
  selector: 'restaurant-fichas-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    FormsModule,
    DataTableComponent,
    LucideIconComponent,
  ],
  templateUrl: './fichas-page.component.html',
  styleUrl:    './fichas-page.component.scss',
})
export class FichasPageComponent {
  protected readonly i18n = inject(I18nService);
  readonly fichas = signal<Ficha[]>([]);

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
    if (editando) {
      this.fichas.update(lista =>
        lista.map(f =>
          f.id === editando.id
            ? { ...f, numero, programa, fechaInicio, fechaFin }
            : f,
        ),
      );
    } else {
      const nueva: Ficha = {
        id:          crypto.randomUUID(),
        numero,
        programa,
        fechaInicio,
        fechaFin,
        activa:      true,
      };
      this.fichas.update(lista => [...lista, nueva]);
    }

    this.onCerrarModal();
  }

  onEliminar(id: string): void {
    if (!confirm(this.i18n.t('fichas.confirmar_eliminar'))) { return; }
    this.fichas.update(lista => lista.filter(f => f.id !== id));
  }
}
