import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IncidenciaService } from '../../data-access/incidencia.service';
import { AuditoriaIncidencia } from '../../models/incidencia.model';
import {
  LucideIconComponent,
  PageHeaderComponent,
  KpiCardComponent,
  SectionTitleComponent,
  StatusBadgeComponent,
  ButtonComponent
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-bar-inicio-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconComponent,
    PageHeaderComponent,
    KpiCardComponent,
    SectionTitleComponent,
    StatusBadgeComponent,
    ButtonComponent
  ],
  templateUrl: './inicio-page.component.html',
  styleUrls: ['./inicio-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InicioPageComponent {
  private incidenciaService = inject(IncidenciaService);

  // Datos simulados para el Dashboard de Bar y Barismo
  estadisticas = {
    activos: 5,
    completados: 32,
    cancelados: 2,
    devueltos: 1
  };

  pedidosPendientes = [
    { mesa: '5', estado: 'Preparando', platos: 'Espresso Colombiano, Limonada de Coco', tiempo: '10 min', clase: 'preparing' },
    { mesa: '12', estado: 'En espera', platos: 'Cappuccino Artesanal, Mojito SENA', tiempo: '5 min', clase: 'waiting' },
    { mesa: '3', estado: 'Listo', platos: 'Café de Filtro V60, Smoothie Tropical', tiempo: '18 min', clase: 'ready' }
  ];

  fechaActual = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // Modal de incidencias
  modalAbierto = signal(false);
  modalTitulo = signal('');
  modalTipo = signal<'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION'>('CANCELACION');
  incidencias = signal<AuditoriaIncidencia[]>([]);
  cargando = signal(false);

  abrirModal(tipo: 'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION') {
    const titulos: Record<string, string> = {
      'CANCELACION': 'Pedidos Cancelados Hoy - Bar',
      'DEVOLUCION': 'Pedidos Devueltos Hoy - Bar',
      'MODIFICACION': 'Pedidos Modificados Hoy - Bar'
    };

    this.modalTipo.set(tipo);
    this.modalTitulo.set(titulos[tipo]);
    this.modalAbierto.set(true);
    this.cargando.set(true);

    // Datos quemados para previsualización (simulando respuesta del backend)
    setTimeout(() => {
      const mockData: AuditoriaIncidencia[] = [];
      
      if (tipo === 'CANCELACION') {
        mockData.push(
          {
            idAuditoria: 'A-001',
            comanda: { idComanda: 'CMD-20045', mesa: { numeroMesa: '5' }, nombreMesero: 'Carlos Ramírez' },
            fechaRegistro: '2026-05-06T14:30:00',
            detalleModificado: 'Mojito SENA, Limonada de Coco',
            tipoIncidencia: 'CANCELACION',
            motivo: 'El cliente cambió de opinión y decidió ordenar un café caliente en su lugar.'
          },
          {
            idAuditoria: 'A-002',
            comanda: { idComanda: 'CMD-20048', mesa: { numeroMesa: '12' }, nombreMesero: 'Laura G.' },
            fechaRegistro: '2026-05-06T15:15:00',
            detalleModificado: 'Cappuccino de Avena',
            tipoIncidencia: 'CANCELACION',
            motivo: 'Falta de ingrediente (leche de avena). Se ofreció leche de almendras pero el cliente no aceptó.'
          },
          {
            idAuditoria: 'A-003',
            comanda: { idComanda: 'CMD-20052', mesa: { numeroMesa: '3' }, nombreMesero: 'Pedro L.' },
            fechaRegistro: '2026-05-05T19:40:00',
            detalleModificado: 'Carajillo Tradicional',
            tipoIncidencia: 'CANCELACION',
            motivo: 'Error al ingresar el pedido, se marcó licor de café en lugar de crema de whisky.'
          }
        );
      } else if (tipo === 'DEVOLUCION') {
        mockData.push(
          {
            idAuditoria: 'D-001',
            comanda: { idComanda: 'CMD-20030', mesa: { numeroMesa: '8' }, nombreMesero: 'Ana M.' },
            fechaRegistro: '2026-05-06T13:20:00',
            detalleModificado: 'Espresso Doble',
            tipoIncidencia: 'DEVOLUCION',
            motivo: 'El café se sirvió frío. Cliente solicitó extracción nueva de inmediato.'
          },
          {
            idAuditoria: 'D-002',
            comanda: { idComanda: 'CMD-20035', mesa: { numeroMesa: '2' }, nombreMesero: 'David R.' },
            fechaRegistro: '2026-05-06T14:10:00',
            detalleModificado: 'Limonada Cerezada',
            tipoIncidencia: 'DEVOLUCION',
            motivo: 'La bebida estaba excesivamente dulce y ácida, no tolerable para el cliente.'
          }
        );
      }

      this.incidencias.set(mockData);
      this.cargando.set(false);
    }, 600);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.incidencias.set([]);
  }

  cerrarConOverlay(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrarModal();
    }
  }

  formatHora(fecha: string): string {
    if (!fecha) return '--:--';
    const d = new Date(fecha);
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  getEtiquetaTipo(tipo: string): string {
    const etiquetas: Record<string, string> = {
      'CANCELACION': 'Motivo de cancelación:',
      'DEVOLUCION': 'Motivo de devolución:',
      'MODIFICACION': 'Detalle de modificación:'
    };
    return etiquetas[tipo] || 'Motivo:';
  }

  getBadgeVariant(estado: string): 'success' | 'warning' | 'danger' | 'info' {
    if (estado === 'Preparando') return 'warning';
    if (estado === 'Listo') return 'success';
    return 'info';
  }
}
