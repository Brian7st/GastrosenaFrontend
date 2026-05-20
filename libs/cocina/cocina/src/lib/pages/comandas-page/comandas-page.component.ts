import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideIconComponent,
  PageHeaderComponent,
  SearchFilterComponent,
  SelectFilterComponent,
  CardComponent,
  ButtonComponent,
  StatusBadgeComponent,
  SectionTitleComponent
} from '@restaurant/shared/ui';

export interface Comanda {
  id: number;
  mesa: string;
  mesero: string;
  platos: string[];
  estado: string;
  prioridad: string;
  tiempo: number;
  hora: string;
}

@Component({
  selector: 'restaurant-comandas-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    LucideIconComponent,
    PageHeaderComponent,
    SearchFilterComponent,
    SelectFilterComponent,
    CardComponent,
    ButtonComponent,
    StatusBadgeComponent,
    SectionTitleComponent
  ],
  templateUrl: './comandas-page.component.html',
  styleUrl: './comandas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComandasPageComponent {
  searchTerm = signal('');
  filtroEstado = signal('Todos los estados');
  filtroPrioridad = signal('Todas las prioridades');
  filtroOrden = signal('Prioridad');

  opcionesEstado = [
    { label: 'Todos los estados', value: 'Todos los estados' },
    { label: 'En Espera', value: 'En Espera' },
    { label: 'Preparando', value: 'Preparando' },
    { label: 'Listo', value: 'Listo' }
  ];
  
  opcionesPrioridad = [
    { label: 'Todas las prioridades', value: 'Todas las prioridades' },
    { label: 'Urgente', value: 'Urgente' },
    { label: 'Alta', value: 'Alta' },
    { label: 'Normal', value: 'Normal' }
  ];
  
  opcionesOrden = [
    { label: 'Prioridad', value: 'Prioridad' },
    { label: 'Hora de llegada', value: 'Hora de llegada' },
    { label: 'Tiempo estimado', value: 'Tiempo estimado' }
  ];

  comandas = signal<Comanda[]>([
    { id: 1, mesa: 'Mesa 5', mesero: 'María G.', platos: ['Pasta Carbonara'], estado: 'En Espera', prioridad: 'Alta', tiempo: 15, hora: '22:30' },
    { id: 2, mesa: 'Mesa 2', mesero: 'Juan P.', platos: ['Hamburguesa'], estado: 'Preparando', prioridad: 'Urgente', tiempo: 25, hora: '22:35' },
    { id: 3, mesa: 'Mesa 8', mesero: 'Carlos M.', platos: ['Pizza Familiar'], estado: 'En Espera', prioridad: 'Normal', tiempo: 10, hora: '22:40' },
    { id: 4, mesa: 'Mesa 1', mesero: 'Dario P.', platos: ['Ensalada César'], estado: 'Listo', prioridad: 'Normal', tiempo: 8, hora: '22:15' }
  ]);

  comandasFiltradas = computed(() => {
    let filtrados = this.comandas().filter(c => {
      const matchBusqueda = c.mesa.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        c.mesero.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchEstado = this.filtroEstado() === 'Todos los estados' || c.estado === this.filtroEstado();
      const matchPrioridad = this.filtroPrioridad() === 'Todas las prioridades' || c.prioridad === this.filtroPrioridad();
      return matchBusqueda && matchEstado && matchPrioridad;
    });

    const criterio = this.filtroOrden();
    if (criterio === 'Prioridad') {
      const niveles: Record<string, number> = { 'Urgente': 3, 'Alta': 2, 'Normal': 1 };
      filtrados.sort((a, b) => niveles[b.prioridad] - niveles[a.prioridad]);
    } else if (criterio === 'Hora de llegada') {
      filtrados.sort((a, b) => a.hora.localeCompare(b.hora));
    } else if (criterio === 'Tiempo estimado') {
      filtrados.sort((a, b) => a.tiempo - b.tiempo);
    }

    return filtrados;
  });

  enEspera = computed(() => this.comandasFiltradas().filter(c => c.estado === 'En Espera'));
  preparando = computed(() => this.comandasFiltradas().filter(c => c.estado === 'Preparando'));
  listos = computed(() => this.comandasFiltradas().filter(c => c.estado === 'Listo'));

  cambiarEstado(comanda: Comanda, nuevoEstado: string) {
    this.comandas.update(actuales =>
      actuales.map(c => c.id === comanda.id ? { ...c, estado: nuevoEstado } : c)
    );
  }

  getBadgeVariant(prioridad: string): 'danger' | 'warning' | 'info' | 'success' {
    if (prioridad === 'Urgente') return 'danger';
    if (prioridad === 'Alta') return 'warning';
    return 'info';
  }
}
