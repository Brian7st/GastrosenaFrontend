import { ChangeDetectionStrategy, Component, inject, computed, signal, OnInit } from '@angular/core';
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
import { CurrencyCopPipe } from '@restaurant/shared/util';
import { I18nService } from '../../i18n/i18n.service';

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
    StatusBadgeComponent,
    CurrencyCopPipe
  ],
  templateUrl: './historial-estudiante-page.component.html',
  styleUrls: ['../historial-instructor-page/historial-instructor-page.component.scss'], // Estilos compartidos
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistorialEstudiantePageComponent implements OnInit {
  protected readonly i18n = inject(I18nService);
  private facade = inject(RestauranteFacade);

  public terminoBusqueda = signal<string>('');
  public filtroEstado = signal<string>('TODAS');

  ngOnInit() {
    this.facade.cargarMisOrdenes();
  }

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

  public ordenesListo = computed(() => this.misOrdenes().filter(o => o.estado === 'LISTO_PARA_SERVIR'));
  public ordenesPreparacion = computed(() => this.misOrdenes().filter(o => o.estado === 'EN_PREPARACION'));
  public ordenesEnviado = computed(() => this.misOrdenes().filter(o => o.estado === 'ENVIADO_COCINA'));
  public ordenesBorrador = computed(() => this.misOrdenes().filter(o => o.estado === 'BORRADOR'));
  public ordenesOtras = computed(() => this.misOrdenes().filter(o => ['ENTREGADO', 'FACTURADO', 'CANCELADO'].includes(o.estado)));

  getBadgeType(estado: string): 'info' | 'success' | 'warning' | 'danger' {
    switch (estado) {
      case 'ENTREGADO': return 'success';
      case 'FACTURADO': return 'success';
      case 'EN_PREPARACION': return 'warning';
      case 'LISTO_PARA_SERVIR': return 'warning';
      case 'BORRADOR': return 'info';
      default: return 'info';
    }
  }

  formatearEstado(estado: string): string {
    if (!estado) return '';
    return estado.replace(/_/g, ' ');
  }

  obtenerNombreMesa(mesaId: string): string {
    const mesa = this.facade.mesas().find(m => m.id === mesaId);
    return mesa ? mesa.nombre : this.i18n.t('historialEstudiante.table') + ' ' + mesaId.substring(0, 4);
  }

  marcarEntregado(pedidoId: string): void {
    this.facade.marcarPedidoComoEntregado(pedidoId);
  }

  obtenerComidas(detalles: any[]) {
    if (!detalles) return [];
    return detalles.filter(d => {
      const cat = (d.categoria || '').toLowerCase();
      return cat !== 'bebidas' && cat !== 'bebida';
    });
  }

  obtenerBebidas(detalles: any[]) {
    if (!detalles) return [];
    return detalles.filter(d => {
      const cat = (d.categoria || '').toLowerCase();
      return cat === 'bebidas' || cat === 'bebida';
    });
  }
}
