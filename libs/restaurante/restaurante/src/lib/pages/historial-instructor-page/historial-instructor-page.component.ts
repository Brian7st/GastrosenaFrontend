import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { 
  LucideIconComponent, 
  CardComponent, 
  PageHeaderComponent, 
  ButtonComponent,
  StatusBadgeComponent
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-historial-instructor-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideIconComponent,
    CardComponent,
    PageHeaderComponent,
    ButtonComponent,
    StatusBadgeComponent
  ],
  templateUrl: './historial-instructor-page.component.html',
  styleUrls: ['./historial-instructor-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistorialInstructorPageComponent {
  public facade = inject(RestauranteFacade);
  
  public todasLasOrdenes = this.facade.ordenesHistorial;
  public meseroFiltrado = signal<string>('');
  public isDropdownOpen = signal<boolean>(false);

  public meserosUnicos = computed(() => {
    const ordenes = this.todasLasOrdenes();
    const meseros = ordenes.map(o => o.meseroId).filter(Boolean);
    return [...new Set(meseros)];
  });

  public ordenes = computed(() => {
    const filtro = this.meseroFiltrado();
    const ordenes = this.todasLasOrdenes();
    if (!filtro) return ordenes;
    return ordenes.filter(o => o.meseroId === filtro);
  });

  toggleDropdown() {
    this.isDropdownOpen.update(v => !v);
  }

  seleccionarMesero(mesero: string) {
    this.meseroFiltrado.set(mesero);
    this.isDropdownOpen.set(false);
  }

  getBadgeType(estado: string): 'info' | 'success' | 'warning' | 'danger' {
    switch (estado) {
      case 'ENTREGADO': return 'success';
      case 'FACTURADO': return 'success';
      case 'EN_PREPARACION': return 'warning';
      case 'BORRADOR': return 'info';
      default: return 'info';
    }
  }
}
