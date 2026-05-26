import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PageHeaderComponent,
  SearchFilterComponent,
  SelectFilterComponent,
  SectionTitleComponent
} from '@restaurant/shared/ui';
import { ComandaService } from '../../data-access/comanda.service';
import { ComandaBarYBarismo } from '../../models/comanda.model';
import { ComandaCardComponent } from '../../components/comanda-card/comanda-card.component';

@Component({
  selector: 'restaurant-bar-comandas-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    PageHeaderComponent,
    SearchFilterComponent,
    SelectFilterComponent,
    SectionTitleComponent,
    ComandaCardComponent
  ],
  templateUrl: './comandas-page.component.html',
  styleUrls: ['./comandas-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComandasComponent implements OnInit {
  private comandaService = inject(ComandaService);

  searchTerm = signal('');
  filtroEstado = signal('Todos los estados');
  filtroPrioridad = signal('Todas las prioridades');
  filtroOrden = signal('Prioridad');

  comandas = signal<ComandaBarYBarismo[]>([]);
  errorToast = signal<string | null>(null);

  opcionesEstado = [
    { label: 'Todos los estados', value: 'Todos los estados' },
    { label: 'PENDIENTE', value: 'PENDIENTE' },
    { label: 'PREPARANDO', value: 'PREPARANDO' },
    { label: 'LISTO', value: 'LISTO' }
  ];
  
  opcionesPrioridad = [
    { label: 'Todas las prioridades', value: 'Todas las prioridades' },
    { label: 'Urgente', value: 'urgente' },
    { label: 'Alta', value: 'alta' },
    { label: 'Normal', value: 'normal' }
  ];
  
  opcionesOrden = [
    { label: 'Prioridad', value: 'Prioridad' },
    { label: 'Hora de llegada', value: 'Hora de llegada' },
    { label: 'Tiempo estimado', value: 'Tiempo estimado' }
  ];

  ngOnInit(): void {
    this.cargarComandas();
  }

  cargarComandas(): void {
    this.comandaService.listarComandas().subscribe({
      next: (data) => this.comandas.set(data),
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
        this.actualizarEstadoItem(idComanda, idDetalle, 'PREPARANDO' as const);
        this.evaluarEstadoComanda(idComanda);
      },
      error: (err) => this.mostrarError('Error al iniciar bebida: ' + err.message)
    });
  }

  onFinalizarPlato(idDetalle: string, idComanda: string) {
    this.comandaService.finalizarDetalle(idDetalle).subscribe({
      next: () => {
        this.actualizarEstadoItem(idComanda, idDetalle, 'LISTO' as const);
        this.evaluarEstadoComanda(idComanda);
      },
      error: (err) => this.mostrarError('Error al finalizar bebida: ' + err.message)
    });
  }

  private actualizarEstadoItem(idComanda: string, idDetalle: string, nuevoEstado: 'PREPARANDO' | 'LISTO') {
    this.comandas.update(comandas => comandas.map(c => {
      if (c.idComanda === idComanda && c.items) {
        const items = c.items.map(i => {
          if (i.idDetalleComanda === idDetalle) {
            const horaFin = nuevoEstado === 'LISTO' ? new Date().toISOString() : i.horaFinPreparacion;
            const duracion = nuevoEstado === 'LISTO' && i.horaInicioPreparacion 
                             ? Math.floor((new Date().getTime() - new Date(i.horaInicioPreparacion).getTime()) / 60000) 
                             : i.duracionMinutos;
            return { 
              ...i, 
              estado: nuevoEstado,
              horaInicioPreparacion: nuevoEstado === 'PREPARANDO' ? new Date().toISOString() : i.horaInicioPreparacion,
              horaFinPreparacion: horaFin,
              duracionMinutos: duracion
            };
          }
          return i;
        });
        return { ...c, items };
      }
      return c;
    }));
  }

  private evaluarEstadoComanda(idComanda: string) {
    this.comandas.update(comandas => comandas.map(c => {
      if (c.idComanda === idComanda && c.items) {
        const todosListos = c.items.every(i => i.estado === 'LISTO');
        const algunoPreparandoOlisto = c.items.some(i => i.estado === 'PREPARANDO' || i.estado === 'LISTO');
        
        let nuevoEstado = c.estadoPreparacion;
        if (todosListos) {
          nuevoEstado = 'LISTO';
        } else if (algunoPreparandoOlisto) {
          nuevoEstado = 'PREPARANDO';
        } else {
          nuevoEstado = 'PENDIENTE';
        }
        return { ...c, estadoPreparacion: nuevoEstado };
      }
      return c;
    }));
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