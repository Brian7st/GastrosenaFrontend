import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  PageHeaderComponent, 
  KpiCardComponent, 
  CardComponent, 
  StatusBadgeComponent, 
  ButtonComponent,
  LucideIconComponent,
  EmptyStateComponent,
} from '@restaurant/shared/ui';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { Mesa } from '../../models/restaurante.model';

@Component({
  selector: 'restaurant-mesas-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    PageHeaderComponent, 
    KpiCardComponent, 
    CardComponent, 
    StatusBadgeComponent, 
    ButtonComponent,
    LucideIconComponent,
    EmptyStateComponent
  ],
  templateUrl: './mesas-page.component.html',
  styleUrl: './mesas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MesasPageComponent {
  private facade = inject(RestauranteFacade);

  // Signals del Facade
  mesas = this.facade.mesas;
  stats = this.facade.stats;

  // Estado local reactivo (Signals)
  modalActivo = signal<string | null>(null);
  mesaSeleccionada = signal<Mesa | null>(null);
  
  // Signals para crear mesa
  nuevoNumero = signal<number>(1);
  nuevoAsientos = signal<number>(4);
  nuevaZona = signal<string>('');
  nuevoActivo = signal<boolean>(true);

  // Signal para eliminar mesa
  mesaIdParaEliminar = signal<number | null>(null);
  
  // Signals para abrir mesa
  nuevoComensal = signal<string>('');
  nuevaNota = signal<string>('');

  abrirModal(nombre: string, mesa: Mesa | null = null) {
    this.modalActivo.set(nombre);
    this.mesaSeleccionada.set(mesa);
    
    if (nombre === 'agregar') {
      const mesas = this.facade.mesas();
      const nextNum = mesas.length > 0 ? Math.max(...mesas.map(m => m.numero)) + 1 : 1;
      this.nuevoNumero.set(nextNum);
      this.nuevoAsientos.set(4);
      this.nuevaZona.set('');
      this.nuevoActivo.set(true);
    } else if (nombre === 'eliminar-global') {
      this.mesaIdParaEliminar.set(null);
    } else if (mesa) {
      this.nuevoComensal.set(mesa.comensal || '');
      this.nuevaNota.set(mesa.notas || '');
    } else {
      this.nuevoComensal.set('');
      this.nuevaNota.set('');
    }
  }

  cerrarModales() {
    this.modalActivo.set(null);
    this.mesaSeleccionada.set(null);
  }

  crearMesa() {
    this.facade.agregarMesa(
      this.nuevoNumero(),
      this.nuevoAsientos(),
      this.nuevaZona(),
      this.nuevoActivo()
    );
    this.cerrarModales();
  }

  abrirMesa(id: number) {
    if (this.nuevoComensal().trim()) {
      this.facade.abrirMesa(id, this.nuevoComensal());
      this.cerrarModales();
    }
  }

  guardarNotas() {
    const mesa = this.mesaSeleccionada();
    if (mesa) {
      this.facade.actualizarNotas(mesa.id, this.nuevaNota());
      this.cerrarModales();
    }
  }

  eliminarMesa(id: number) {
    this.facade.eliminarMesa(id);
    this.cerrarModales();
  }

  liberarMesa(id: number) {
    this.facade.liberarMesa(id);
    this.cerrarModales();
  }

  getBadgeType(estado: string): 'info' | 'success' | 'warning' | 'danger' {
    switch (estado) {
      case 'libre': return 'success';
      case 'ocupada': return 'danger';
      case 'por_pagar': return 'warning';
      default: return 'info';
    }
  }
}
