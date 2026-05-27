import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, timer } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { IncidenciaService } from '../../data-access/incidencia.service';
import { ComandaService } from '../../data-access/comanda.service';
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
    FormsModule,
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
export class InicioPageComponent implements OnInit, OnDestroy {
  private incidenciaService = inject(IncidenciaService);
  private comandaService = inject(ComandaService);
  private destroy$ = new Subject<void>();

  // Datos iniciales
  estadisticas = signal({
    activos: 0,
    completados: 0,
    cancelados: 3, // Pendiente de conexión a endpoints de incidencias
    devueltos: 2   // Pendiente de conexión a endpoints de incidencias
  });

  pedidosPendientes = signal<any[]>([]);

  ngOnInit() {
    // Polling cada 5 segundos
    timer(0, 5000)
      .pipe(
        switchMap(() => this.comandaService.getComandas()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (comandas) => {
          const activos = comandas.filter(c => c.estado === 'PENDIENTE').length;
          const completados = comandas.filter(c => c.estado === 'LISTO').length;
          
          this.todasListas = comandas.filter(c => c.estado === 'LISTO')
                                     .sort((a, b) => new Date(b.horaEntrada).getTime() - new Date(a.horaEntrada).getTime());
          
          this.estadisticas.update(s => ({
            ...s,
            activos,
            completados
          }));

          this.pedidosPendientes.set(
            comandas
              .filter(c => c.estado !== 'LISTO')
              .slice(0, 3)
              .map(c => {
                 const platosStr = c.detalles ? c.detalles.map((d: any) => `${d.cantidad}x ${d.nombrePlato || d.receta?.nombre}`).join(', ') : 'Sin platos';
                 const elapsedMs = new Date().getTime() - new Date(c.horaEntrada).getTime();
                 const elapsedMin = Math.floor(elapsedMs / 60000);
                 const horas = Math.floor(elapsedMin / 60);
                 const mins = elapsedMin % 60;
                 const tiempoFormateado = `${horas.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}`;
                 return {
                   mesa: c.numeroMesa,
                   estado: c.estado,
                   platos: platosStr,
                   tiempo: tiempoFormateado
                 };
              })
          );
        },
        error: (err) => console.error('Error cargando comandas en inicio', err)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fechaActual = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // Modal de incidencias
  modalAbierto = signal(false);
  modalTitulo = signal('');
  modalTipo = signal<'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION'>('CANCELACION');
  incidencias = signal<AuditoriaIncidencia[]>([]);
  cargando = signal(false);

  busquedaModal = signal('');
  fechaInicioEliminar = signal('');
  fechaFinEliminar = signal('');

  get minDateAnioActual(): string {
    return '2025-01-01';
  }

  get maxDateAnioActual(): string {
    const year = new Date().getFullYear();
    return `${year}-12-31`;
  }

  incidenciasFiltradas = computed(() => {
    const term = this.busquedaModal().toLowerCase();
    const list = this.incidencias();
    if (!term) return list;
    return list.filter(inc => {
       const mesa = inc.comanda.mesa?.numeroMesa || '';
       const mesero = inc.comanda.nombreMesero || '';
       const id = inc.comanda.idComanda || '';
       const dateStr = new Date(inc.fechaRegistro).toLocaleDateString();
       
       return mesa.toLowerCase().includes(term) || 
              mesero.toLowerCase().includes(term) || 
              id.toLowerCase().includes(term) ||
              dateStr.includes(term);
    });
  });

  todasListas: any[] = [];

  abrirModal(tipo: 'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION' | 'LISTAS') {
    const titulos: Record<string, string> = {
      'CANCELACION': 'Pedidos Cancelados Hoy - Cocina',
      'DEVOLUCION': 'Pedidos Devueltos Hoy - Cocina',
      'MODIFICACION': 'Pedidos Modificados Hoy - Cocina',
      'LISTAS': 'Todas las Comandas Listas'
    };

    this.modalTipo.set(tipo as any);
    this.modalTitulo.set(titulos[tipo]);
    this.modalAbierto.set(true);
    
    if (tipo === 'LISTAS') {
       this.cargando.set(false);
       this.incidencias.set(this.todasListas.map(c => ({
           idAuditoria: c.idComanda,
           comanda: { idComanda: c.idComanda, mesa: { numeroMesa: c.numeroMesa?.toString() || '0' }, nombreMesero: c.nombreMesero },
           fechaRegistro: c.horaEntrada,
           detalleModificado: c.detalles ? c.detalles.map((d: any) => `${d.cantidad}x ${d.nombrePlato || d.receta?.nombre}`).join(', ') : '',
           tipoIncidencia: 'LISTAS' as any,
           motivo: 'Comanda procesada y entregada correctamente.'
       })));
       return;
    }

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
      'MODIFICACION': 'Detalle de modificación:',
      'LISTAS': 'Estado actual:'
    };
    return etiquetas[tipo] || 'Motivo:';
  }

  getBadgeVariant(estado: string): 'success' | 'warning' | 'danger' | 'info' {
    if (estado === 'PREPARANDO') return 'warning';
    if (estado === 'LISTO') return 'success';
    if (estado === 'PENDIENTE') return 'info';
    return 'info';
  }

  eliminarComandaIndividual(id: string) {
    if (confirm(`¿Eliminar permanentemente la comanda #${id.slice(0,8).toUpperCase()}?`)) {
      this.comandaService.eliminarComandaPorId(id).subscribe({
        next: () => {
          this.incidencias.update(list => list.filter(i => i.idAuditoria !== id));
          this.todasListas = this.todasListas.filter(c => c.idComanda !== id);
        },
        error: (err) => {
          console.error('Error eliminando comanda:', err);
          alert('No se pudo eliminar la comanda. Verifica la conexión con el servidor.');
        }
      });
    }
  }

  eliminarPorRango() {
    const inicio = this.fechaInicioEliminar();
    const fin = this.fechaFinEliminar();
    
    if (!inicio || !fin) {
      alert('Por favor selecciona ambas fechas para el rango de eliminación.');
      return;
    }
    
    const fechaInicioISO = `${inicio}T00:00:00`;
    const fechaFinISO = `${fin}T23:59:59`;

    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente TODAS las comandas listas entre ${inicio} y ${fin}?`)) {
      this.comandaService.limpiarComandas(fechaInicioISO, fechaFinISO).subscribe({
        next: () => {
          const dInicio = new Date(inicio).getTime();
          const dFin = new Date(fin).getTime() + 86400000;
          this.incidencias.update(list => list.filter(i => {
             const t = new Date(i.fechaRegistro).getTime();
             return !(t >= dInicio && t < dFin);
          }));
          this.todasListas = this.todasListas.filter(c => {
             const t = new Date(c.horaEntrada).getTime();
             return !(t >= dInicio && t < dFin);
          });
          alert('Limpieza exitosa. Las comandas han sido eliminadas de la base de datos.');
        },
        error: (err) => {
          console.error('Error al limpiar comandas:', err);
          alert('Hubo un error al intentar eliminar las comandas. Asegúrate de que el backend esté ejecutándose.');
        }
      });
    }
  }
}
