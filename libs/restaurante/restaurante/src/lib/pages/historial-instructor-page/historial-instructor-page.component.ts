import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
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
import { I18nService } from '../../i18n/i18n.service';

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
export class HistorialInstructorPageComponent implements OnInit {
  protected readonly i18n = inject(I18nService);
  public facade = inject(RestauranteFacade);
  
  public todasLasOrdenes = this.facade.ordenesHistorial;
  public meseroFiltrado = signal<string>('');
  public terminoBusqueda = signal<string>('');
  public filtroEstado = signal<string>('TODAS');
  public isDropdownOpen = signal<boolean>(false);

  ngOnInit() {
    this.facade.cargarTodasLasOrdenes();
  }

  public meserosUnicos = computed(() => {
    const ordenes = this.todasLasOrdenes();
    const meseros = ordenes.map(o => o.meseroId).filter(Boolean);
    return [...new Set(meseros)];
  });

  public ordenes = computed(() => {
    const filtro = this.meseroFiltrado();
    const busqueda = this.terminoBusqueda().toLowerCase().trim();
    let ordenes = this.todasLasOrdenes();

    if (filtro) {
      ordenes = ordenes.filter(o => o.meseroId === filtro);
    }

    if (busqueda) {
      ordenes = ordenes.filter(o => o.id.toLowerCase().includes(busqueda));
    }

    return ordenes;
  });

  public ordenesListo = computed(() => this.ordenes().filter(o => o.estado === 'LISTO_PARA_SERVIR'));
  public ordenesPreparacion = computed(() => this.ordenes().filter(o => o.estado === 'EN_PREPARACION'));
  public ordenesEnviado = computed(() => this.ordenes().filter(o => o.estado === 'ENVIADO_COCINA'));
  public ordenesBorrador = computed(() => this.ordenes().filter(o => o.estado === 'BORRADOR'));
  public ordenesOtras = computed(() => this.ordenes().filter(o => ['ENTREGADO', 'FACTURADO', 'CANCELADO'].includes(o.estado)));

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
    return mesa ? mesa.nombre : this.i18n.t('historialInstructor.table') + ' ' + mesaId.substring(0, 4);
  }

  acortarMesero(meseroId: string): string {
    if (!meseroId) return 'N/A';
    return meseroId.length > 8 ? 'Waiter ' + meseroId.substring(meseroId.length - 8) : meseroId;
  }
}
