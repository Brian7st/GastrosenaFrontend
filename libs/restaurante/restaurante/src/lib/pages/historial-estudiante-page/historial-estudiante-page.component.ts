import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    RouterLink,
    LucideIconComponent,
    CardComponent,
    PageHeaderComponent,
    ButtonComponent,
    StatusBadgeComponent
  ],
  templateUrl: './historial-estudiante-page.component.html',
  styleUrls: ['../historial-instructor-page/historial-instructor-page.component.scss'], // Reusing the same styles as they are visually identical
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistorialEstudiantePageComponent {
  private facade = inject(RestauranteFacade);

  // Prototipo: mostramos todos los pedidos pero en el futuro aquí se filtrará:
  // public misOrdenes = computed(() => this.facade.ordenesHistorial().filter(o => o.meseroId === this.authService.getUsuarioId()));
  public misOrdenes = this.facade.ordenesHistorial;

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
