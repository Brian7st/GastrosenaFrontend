import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IncidenciaService } from '../../data-access/incidencia.service';
import { AuditoriaIncidencia } from '../../models/incidencia.model';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-inicio-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
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

    this.incidenciaService.obtenerPorTipo(tipo).subscribe({
      next: (data) => {
        this.incidencias.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.incidencias.set([]);
        this.cargando.set(false);
      }
    });
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
}
