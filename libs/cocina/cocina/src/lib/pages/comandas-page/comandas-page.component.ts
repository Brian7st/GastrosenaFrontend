import { Component, signal, computed, ChangeDetectionStrategy, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ComandaCardComponent } from '../../components/comanda-card/comanda-card.component';
import { ComandaService, Comanda } from '../../data-access/comanda.service';
import {
  PageHeaderComponent,
  SearchFilterComponent,
  SelectFilterComponent,
  SectionTitleComponent
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-comandas-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ComandaCardComponent,
    PageHeaderComponent,
    SearchFilterComponent,
    SelectFilterComponent
  ],
  templateUrl: './comandas-page.component.html',
  styleUrl: './comandas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComandasPageComponent implements OnInit, OnDestroy {
  private comandaService = inject(ComandaService);
  private pollingSub?: Subscription;

  searchTerm = signal('');
  filtroEstado = signal('Todos los estados');
  filtroOrden = signal('Hora de llegada');

  comandas = signal<Comanda[]>([]);
  errorToast = signal<string | null>(null);

  opcionesEstado = [
    { label: 'Todos los estados', value: 'Todos los estados' },
    { label: 'PENDIENTE', value: 'PENDIENTE' },
    { label: 'PREPARANDO', value: 'PREPARANDO' },
    { label: 'LISTO', value: 'LISTO' }
  ];

  opcionesOrden = [
    { label: 'Hora de llegada', value: 'Hora de llegada' },
    { label: 'Tiempo estimado', value: 'Tiempo estimado' }
  ];

  ngOnInit() {
    this.cargarComandas();
    this.pollingSub = interval(5000).subscribe(() => this.cargarComandas());
  }

  ngOnDestroy() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  cargarComandas() {
    this.comandaService.getComandas().subscribe({
      next: (data) => {
        const now = new Date();

        const comandasFiltradas = data.filter(c => {
          const estado = (c.estado || '').toUpperCase();

          // Comandas CANCELADAS por completo → no aparecen en el kanban (van a Inicio > Canceladas)
          if (estado === 'CANCELADO' || estado === 'CANCELADA') {
            return false;
          }

          // Comandas de DEVOLUCIÓN ya LISTAS → salen del tablero (van a Inicio > Devueltos).
          // Mientras no estén listas, se quedan en el tablero para re-cocinarse.
          if (c.esDevolucion && estado === 'LISTO') {
            return false;
          }

          // Comandas LISTO → solo del día actual
          if (estado === 'LISTO') {
            const fechaComanda = new Date(c.horaEntrada);
            return fechaComanda.getDate() === now.getDate() &&
                   fechaComanda.getMonth() === now.getMonth() &&
                   fechaComanda.getFullYear() === now.getFullYear();
          }

          // Si la comanda tiene algún plato CANCELADO pero la comanda NO está cancelada completa,
          // la comanda permanece en el kanban con los platos NO cancelados (los cancelados
          // se duplican y van a Inicio > Canceladas).
          // → La comanda sigue mostrándose normalmente con todos sus platos.
          return true;
        });

        this.comandas.set(comandasFiltradas);
      },
      error: (err) => {
        console.error('Error fetching comandas:', err);
        this.mostrarError('Error de conexión con el backend');
      }
    });
  }

  mostrarError(msg: string) {
    this.errorToast.set(msg);
    setTimeout(() => this.errorToast.set(null), 3000);
  }

  onIniciarPlato(idDetalle: string, idComanda: string) {
    this.comandaService.iniciarDetalle(idDetalle).subscribe({
      next: () => {
        this.actualizarEstadoPlato(idComanda, idDetalle, 'PREPARANDO');
        this.evaluarEstadoComanda(idComanda);
      },
      error: (err) => this.mostrarError('Error al iniciar plato: ' + err.message)
    });
  }

  onFinalizarPlato(idDetalle: string, idComanda: string) {
    this.comandaService.finalizarDetalle(idDetalle).subscribe({
      next: () => {
        this.actualizarEstadoPlato(idComanda, idDetalle, 'LISTO');
        this.evaluarEstadoComanda(idComanda);
      },
      error: (err) => this.mostrarError('Error al finalizar plato: ' + err.message)
    });
  }

  private actualizarEstadoPlato(idComanda: string, idDetalle: string, nuevoEstado: 'PREPARANDO' | 'LISTO') {
    this.comandas.update(comandas => comandas.map(c => {
      if (c.idComanda === idComanda) {
        const detalles = c.detalles.map(d => {
          if (d.idDetalleComanda === idDetalle) {
            const horaFin = nuevoEstado === 'LISTO' ? new Date().toISOString() : d.horaFinPreparacion;
            const duracion = nuevoEstado === 'LISTO' && d.horaInicioPreparacion
                             ? Math.floor((new Date().getTime() - new Date(d.horaInicioPreparacion).getTime()) / 60000)
                             : d.duracionMinutos;
            return {
              ...d,
              estado: nuevoEstado,
              horaInicioPreparacion: nuevoEstado === 'PREPARANDO' ? new Date().toISOString() : d.horaInicioPreparacion,
              horaFinPreparacion: horaFin,
              duracionMinutos: duracion
            };
          }
          return d;
        });
        return { ...c, detalles };
      }
      return c;
    }));
  }

  private evaluarEstadoComanda(idComanda: string) {
    this.comandas.update(comandas => comandas.map(c => {
      if (c.idComanda === idComanda) {
        // Solo considerar platos activos (no cancelados/devueltos) para el estado
        const platosActivos = c.detalles.filter(d => {
          const e = (d.estado || '').toUpperCase();
          return e !== 'CANCELADO' && e !== 'DEVUELTO';
        });
        const todosListos = platosActivos.length > 0 && platosActivos.every(d => d.estado === 'LISTO');
        const algunoPreparandoOlisto = platosActivos.some(d => d.estado === 'PREPARANDO' || d.estado === 'LISTO');

        let nuevoEstado = c.estado;
        if (c.estado === 'LISTO' || (todosListos && platosActivos.length > 0)) {
          nuevoEstado = 'LISTO';
        } else if (algunoPreparandoOlisto) {
          nuevoEstado = 'PREPARANDO';
        } else {
          nuevoEstado = 'PENDIENTE';
        }
        return { ...c, estado: nuevoEstado };
      }
      return c;
    }));
  }

  comandasFiltradas = computed(() => {
    const filtrados = this.comandas().filter(c => {
      const term = this.searchTerm().toLowerCase();
      const matchBusqueda = c.numeroMesa.toString().includes(term) ||
                            c.nombreMesero.toLowerCase().includes(term) ||
                            c.idComanda.toLowerCase().includes(term);
      const matchEstado = this.filtroEstado() === 'Todos los estados' || c.estado === this.filtroEstado();
      return matchBusqueda && matchEstado;
    });

    return filtrados;
  });

  enEspera = computed(() => this.comandasFiltradas().filter(c => {
    const s = c.estado?.toUpperCase() || '';
    return s.includes('PENDIENTE') || s.includes('ESPERA');
  }));

  preparando = computed(() => this.comandasFiltradas().filter(c => {
    const s = c.estado?.toUpperCase() || '';
    return s.includes('PREPARAN') || s.includes('PROCESO');
  }));

  listos = computed(() => this.comandasFiltradas().filter(c => {
    const s = c.estado?.toUpperCase() || '';
    return s.includes('LISTO') || s.includes('TERMINAD');
  }));

}
