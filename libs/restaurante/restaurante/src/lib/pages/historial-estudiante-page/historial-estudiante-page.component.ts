import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { AuthService } from '../../data-access/auth.service';
import { 
  LucideIconComponent, 
  CardComponent, 
  PageHeaderComponent, 
  ButtonComponent,
  StatusBadgeComponent
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-historial-estudiante-page',
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
  templateUrl: './historial-estudiante-page.component.html',
  styleUrls: ['../historial-instructor-page/historial-instructor-page.component.scss'], // Estilos compartidos
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistorialEstudiantePageComponent {
  private facade = inject(RestauranteFacade);

  public terminoBusqueda = signal<string>('');

  // Prototipo: mostramos todos los pedidos pero en el futuro aquí se filtrará:
  public todasMisOrdenes = this.facade.ordenesHistorial;

  public misOrdenes = computed(() => {
    const busqueda = this.terminoBusqueda().toLowerCase().trim();
    let ordenes = this.todasMisOrdenes();

    if (busqueda) {
      ordenes = ordenes.filter(o => o.id.toLowerCase().includes(busqueda));
    }

    return ordenes;
  });

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
