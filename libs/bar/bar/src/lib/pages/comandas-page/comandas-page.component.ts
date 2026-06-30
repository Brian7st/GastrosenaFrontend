import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import {
  PageHeaderComponent,
  SearchFilterComponent,
  SelectFilterComponent
} from '@restaurant/shared/ui';
import { ComandaService } from '../../data-access/comanda.service';
import { ComandaBarYBarismo, ComandaItem } from '../../models/comanda.model';
import { ComandaCardComponent } from '../../components/comanda-card/comanda-card.component';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'restaurant-bar-comandas-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    PageHeaderComponent,
    SearchFilterComponent,
    SelectFilterComponent,
    ComandaCardComponent
  ],
  templateUrl: './comandas-page.component.html',
  styleUrls: ['./comandas-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComandasComponent implements OnInit, OnDestroy {
  private comandaService = inject(ComandaService);
  protected readonly i18n = inject(I18nService);
  private pollingSub: Subscription | null = null;

  searchTerm = signal('');
  filtroEstado = signal('Todos los estados');
  filtroPrioridad = signal('Todas las prioridades');
  filtroOrden = signal('Prioridad');

  comandas = signal<ComandaBarYBarismo[]>([]);
  errorToast = signal<string | null>(null);

  opcionesEstado = computed(() => [
    { label: this.i18n.t('comandas.filter.all-statuses'), value: 'Todos los estados' },
    { label: 'PENDIENTE', value: 'PENDIENTE' },
    { label: 'PREPARANDO', value: 'PREPARANDO' },
    { label: 'LISTO', value: 'LISTO' }
  ]);
  
  opcionesPrioridad = computed(() => [
    { label: this.i18n.t('comandas.filter.all-priorities'), value: 'Todas las prioridades' },
    { label: this.i18n.t('comandas.filter.priority-urgent'), value: 'urgente' },
    { label: this.i18n.t('comandas.filter.priority-high'), value: 'alta' },
    { label: this.i18n.t('comandas.filter.priority-normal'), value: 'normal' }
  ]);
  
  opcionesOrden = computed(() => [
    { label: this.i18n.t('comandas.filter.sort-priority'), value: 'Prioridad' },
    { label: this.i18n.t('comandas.filter.sort-arrival'), value: 'Hora de llegada' },
    { label: this.i18n.t('comandas.filter.sort-estimated'), value: 'Tiempo estimado' }
  ]);

  ngOnInit(): void {
    this.cargarComandas();
    this.pollingSub = interval(5000).subscribe(() => this.cargarComandas());
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  cargarComandas(): void {
    this.comandaService.listarComandas().subscribe({
      next: (data) => {
        const now = new Date();
        const filtradas = data.filter(c => {
          if (c.estadoPreparacion === 'LISTO') {
            const fecha = new Date(c.horaEntrada);
            return fecha.getDate() === now.getDate() &&
                   fecha.getMonth() === now.getMonth() &&
                   fecha.getFullYear() === now.getFullYear();
          }
          return true;
        });
        this.comandas.set(filtradas);
      },
      error: (err) => {
        console.error('Error fetching comandas:', err);
        this.mostrarError(this.i18n.t('comandas.error.connection'));
      }
    });
  }

  mostrarError(msg: string) {
    this.errorToast.set(msg);
    setTimeout(() => this.errorToast.set(null), 3000);
  }

  onIniciarPlato(idDetalle: string) {
    this.comandaService.iniciarDetalle(idDetalle).subscribe({
      next: () => this.actualizarEstadoItem(idDetalle, 'PREPARANDO'),
      error: (err) => this.mostrarError(this.i18n.t('comandas.error.start-drink') + err.message)
    });
  }

  onFinalizarPlato(idDetalle: string) {
    this.comandaService.finalizarDetalle(idDetalle).subscribe({
      next: () => this.actualizarEstadoItem(idDetalle, 'LISTO'),
      error: (err) => this.mostrarError(this.i18n.t('comandas.error.finish-drink') + err.message)
    });
  }

  private actualizarEstadoItem(idDetalle: string, nuevoEstado: 'PREPARANDO' | 'LISTO') {
    this.comandas.update(comandas => comandas.map(c => {
      if (!c.items?.some(i => i.idDetalleComanda === idDetalle)) return c;
      const items = c.items.map(i => {
        if (i.idDetalleComanda !== idDetalle) return i;
        return {
          ...i,
          estado: nuevoEstado,
          horaInicioPreparacion: nuevoEstado === 'PREPARANDO'
            ? (i.horaInicioPreparacion || new Date().toISOString())
            : i.horaInicioPreparacion,
          horaFinPreparacion: nuevoEstado === 'LISTO' ? new Date().toISOString() : i.horaFinPreparacion,
          duracionMinutos: nuevoEstado === 'LISTO' && i.horaInicioPreparacion
            ? Math.floor((new Date().getTime() - new Date(i.horaInicioPreparacion).getTime()) / 60000)
            : i.duracionMinutos
        };
      });
      return { ...c, items, estadoPreparacion: this.calcularEstadoComanda(items, c.estadoPreparacion) };
    }));
  }

  private calcularEstadoComanda(items: ComandaItem[], estadoActual: string): string {
    if (items.length === 0) return estadoActual;
    const todosListos = items.every(i => i.estado === 'LISTO');
    const algunoPreparandoOlisto = items.some(i => i.estado === 'PREPARANDO' || i.estado === 'LISTO');
    if (todosListos) return 'LISTO';
    if (algunoPreparandoOlisto) return 'PREPARANDO';
    return 'PENDIENTE';
  }

  comandasFiltradas = computed(() => {
    const filtrados = this.comandas().filter(c => {
      const matchBusqueda = c.numeroMesa.toString().includes(this.searchTerm()) || 
                            (c.mesero && c.mesero.toLowerCase().includes(this.searchTerm().toLowerCase())) ||
                            (c.preparacion && c.preparacion.toLowerCase().includes(this.searchTerm().toLowerCase()));
      const matchEstado = this.filtroEstado() === 'Todos los estados' || c.estadoPreparacion === this.filtroEstado();
      const matchPrioridad = this.filtroPrioridad() === 'Todas las prioridades' || c.prioridad === this.filtroPrioridad();
      return matchBusqueda && matchEstado && matchPrioridad;
    });

    const criterio = this.filtroOrden();
    if (criterio === 'Prioridad') {
      const niveles: Record<string, number> = { 'urgente': 3, 'alta': 2, 'normal': 1 };
      filtrados.sort((a, b) => niveles[b.prioridad || 'normal'] - niveles[a.prioridad || 'normal']);
    } else if (criterio === 'Hora de llegada') {
      filtrados.sort((a, b) => new Date(a.horaEntrada).getTime() - new Date(b.horaEntrada).getTime());
    } else if (criterio === 'Tiempo estimado') {
      filtrados.sort((a, b) => (a.tiempoEstimado || 0) - (b.tiempoEstimado || 0));
    }

    return filtrados;
  });

  enEspera = computed(() => this.comandasFiltradas().filter(c => c.estadoPreparacion === 'PENDIENTE'));
  preparando = computed(() => this.comandasFiltradas().filter(c => c.estadoPreparacion === 'PREPARANDO'));
  listos = computed(() => this.comandasFiltradas().filter(c => c.estadoPreparacion === 'LISTO'));
}
