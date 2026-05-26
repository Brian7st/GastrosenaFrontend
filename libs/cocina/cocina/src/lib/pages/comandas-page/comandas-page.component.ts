import { Component, signal, computed, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    SelectFilterComponent,
    SectionTitleComponent
  ],
  templateUrl: './comandas-page.component.html',
  styleUrl: './comandas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComandasPageComponent implements OnInit {
  private comandaService = inject(ComandaService);

  searchTerm = signal('');
  filtroEstado = signal('Todos los estados');
  filtroPrioridad = signal('Todas las prioridades');
  filtroOrden = signal('Prioridad');

  comandas = signal<Comanda[]>([]);
  errorToast = signal<string | null>(null);

  opcionesEstado = [
    { label: 'Todos los estados', value: 'Todos los estados' },
    { label: 'PENDIENTE', value: 'PENDIENTE' },
    { label: 'PREPARANDO', value: 'PREPARANDO' },
    { label: 'LISTO', value: 'LISTO' }
  ];
  
  opcionesPrioridad = [
    { label: 'Todas las prioridades', value: 'Todas las prioridades' },
    { label: 'URGENTE', value: 'URGENTE' },
    { label: 'ALTA', value: 'ALTA' },
    { label: 'NORMAL', value: 'NORMAL' }
  ];
  
  opcionesOrden = [
    { label: 'Prioridad', value: 'Prioridad' },
    { label: 'Hora de llegada', value: 'Hora de llegada' },
    { label: 'Tiempo estimado', value: 'Tiempo estimado' }
  ];

  ngOnInit() {
    this.cargarComandas();
  }

  cargarComandas() {
    this.comandaService.getComandas().subscribe({
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
        const todosListos = c.detalles.every(d => d.estado === 'LISTO');
        const algunoPreparandoOlisto = c.detalles.some(d => d.estado === 'PREPARANDO' || d.estado === 'LISTO');
        
        let nuevoEstado = c.estado;
        if (todosListos) {
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
    let filtrados = this.comandas().filter(c => {
      const matchBusqueda = c.numeroMesa.toString().includes(this.searchTerm()) || 
                            c.nombreMesero.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchEstado = this.filtroEstado() === 'Todos los estados' || c.estado === this.filtroEstado();
      const matchPrioridad = this.filtroPrioridad() === 'Todas las prioridades' || c.prioridad === this.filtroPrioridad();
      return matchBusqueda && matchEstado && matchPrioridad;
    });

    const criterio = this.filtroOrden();
    if (criterio === 'Prioridad') {
      const niveles: Record<string, number> = { 'URGENTE': 3, 'ALTA': 2, 'NORMAL': 1 };
      filtrados.sort((a, b) => niveles[b.prioridad] - niveles[a.prioridad]);
    }

    return filtrados;
  });

  enEspera = computed(() => this.comandasFiltradas().filter(c => c.estado === 'PENDIENTE'));
  preparando = computed(() => this.comandasFiltradas().filter(c => c.estado === 'PREPARANDO'));
  listos = computed(() => this.comandasFiltradas().filter(c => c.estado === 'LISTO'));

  getMockComandas(): Comanda[] {
    const now = new Date();
    const minus10 = new Date(now.getTime() - 10 * 60000).toISOString();
    const minus25 = new Date(now.getTime() - 25 * 60000).toISOString();
    return [
      {
        idComanda: 'uuid-comanda-1',
        numeroMesa: 5,
        nombreMesero: 'María G.',
        prioridad: 'ALTA',
        estado: 'PENDIENTE',
        fechaPedido: minus25,
        horaEntrada: minus10,
        notasAdicionales: 'Mesa exterior',
        detalles: [
          { idDetalleComanda: 'uuid-det-101', idReceta: 'uuid-rec-1', receta: { nombre: 'Pasta Carbonara' }, cantidad: 1, estado: 'ESPERA', notas: 'Sin queso' },
          { idDetalleComanda: 'uuid-det-102', idReceta: 'uuid-rec-2', receta: { nombre: 'Jugo de Mora' }, cantidad: 2, estado: 'ESPERA', notas: 'En agua' }
        ]
      },
      {
        idComanda: 'uuid-comanda-2',
        numeroMesa: 2,
        nombreMesero: 'Juan P.',
        prioridad: 'URGENTE',
        estado: 'PREPARANDO',
        fechaPedido: minus25,
        horaEntrada: minus25,
        notasAdicionales: '',
        detalles: [
          { idDetalleComanda: 'uuid-det-201', idReceta: 'uuid-rec-3', receta: { nombre: 'Hamburguesa' }, cantidad: 1, estado: 'PREPARANDO', notas: 'Término medio', horaInicioPreparacion: minus10 },
          { idDetalleComanda: 'uuid-det-202', idReceta: 'uuid-rec-4', receta: { nombre: 'Papas Fritas' }, cantidad: 1, estado: 'ESPERA', notas: '' }
        ]
      }
    ];
  }

  getBadgeVariant(prioridad: string): 'danger' | 'warning' | 'info' | 'success' {
    if (prioridad === 'Urgente') return 'danger';
    if (prioridad === 'Alta') return 'warning';
    return 'info';
  }
}
