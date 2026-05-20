import { Component, inject, signal } from '@angular/core';
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
  selector: 'restaurant-inicio-page',
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
  styleUrls: ['./inicio-page.component.scss']
})
export class InicioPageComponent {
  private incidenciaService = inject(IncidenciaService);

  // Datos simulados para el Dashboard
  estadisticas = {
    activos: 8,
    completados: 47,
    cancelados: 3,
    devueltos: 2
  };

  pedidosPendientes = [
    { mesa: '5', estado: 'Preparando', platos: 'Pasta Carbonara, Ensalada César', tiempo: '15 min', clase: 'preparing' },
    { mesa: '12', estado: 'En espera', platos: 'Pizza Margherita, Papas Fritas', tiempo: '8 min', clase: 'waiting' },
    { mesa: '3', estado: 'Listo', platos: 'Burger Deluxe, Sopa del Día', tiempo: '22 min', clase: 'ready' }
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
      'CANCELACION': 'Pedidos Cancelados Hoy - Cocina',
      'DEVOLUCION': 'Pedidos Devueltos Hoy - Cocina',
      'MODIFICACION': 'Pedidos Modificados Hoy - Cocina'
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
            comanda: { idComanda: 'CMD-10045', mesa: { numeroMesa: '5' }, nombreMesero: 'Carlos Ramírez' },
            fechaRegistro: '2026-05-06T14:30:00',
            detalleModificado: 'Bandeja Paisa, Sopa de Lentejas',
            tipoIncidencia: 'CANCELACION',
            motivo: 'El cliente se retiró del restaurante antes de que se empezara a preparar el plato debido a una emergencia.'
          },
          {
            idAuditoria: 'A-002',
            comanda: { idComanda: 'CMD-10048', mesa: { numeroMesa: '12' }, nombreMesero: 'Laura G.' },
            fechaRegistro: '2026-05-06T15:15:00',
            detalleModificado: 'Filete de Salmón en Salsa de Maracuyá',
            tipoIncidencia: 'CANCELACION',
            motivo: 'Falta de ingredientes críticos (Salmón fresco). Se ofreció alternativa pero fue rechazada.'
          },
          {
            idAuditoria: 'A-003',
            comanda: { idComanda: 'CMD-10052', mesa: { numeroMesa: '3' }, nombreMesero: 'Pedro L.' },
            fechaRegistro: '2026-05-05T19:40:00',
            detalleModificado: 'Hamburguesa Artesanal, Papas Fritas',
            tipoIncidencia: 'CANCELACION',
            motivo: 'Error al tomar el pedido, el comensal quería la versión vegana y se ordenó la tradicional.'
          }
        );
      } else if (tipo === 'DEVOLUCION') {
        mockData.push(
          {
            idAuditoria: 'D-001',
            comanda: { idComanda: 'CMD-10030', mesa: { numeroMesa: '8' }, nombreMesero: 'Ana M.' },
            fechaRegistro: '2026-05-06T13:20:00',
            detalleModificado: 'Churrasco Término Medio',
            tipoIncidencia: 'DEVOLUCION',
            motivo: 'El plato llegó frío a la mesa y la carne estaba casi cruda. Cliente solicitó cambio inmediato.'
          },
          {
            idAuditoria: 'D-002',
            comanda: { idComanda: 'CMD-10035', mesa: { numeroMesa: '2' }, nombreMesero: 'David R.' },
            fechaRegistro: '2026-05-06T14:10:00',
            detalleModificado: 'Crema de Champiñones',
            tipoIncidencia: 'DEVOLUCION',
            motivo: 'La sopa tenía exceso de sal, incomible según el reporte del comensal.'
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
