import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, timer, forkJoin } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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

/** Tipos de modal de confirmación */
type ConfirmAction = 'eliminar-individual' | 'eliminar-rango' | 'info';

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
    cancelados: 0,
    devueltos: 0
  });

  pedidosPendientes = signal<any[]>([]);

  ngOnInit() {
    // Polling cada 5 segundos para comandas (resistente: un error de red no mata el stream)
    timer(0, 5000)
      .pipe(
        switchMap(() => this.comandaService.getComandas().pipe(catchError(() => of([] as any[])))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (comandas) => {
          const activos = comandas.filter(c => c.estado === 'PENDIENTE' || c.estado === 'PREPARANDO').length;
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

    // Conteo de canceladas/devueltas: también en vivo cada 5s.
    timer(0, 5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cargarConteoIncidencias());
  }

  cargarConteoIncidencias() {
    // Intentar con el endpoint de conteo; si no existe, contar manualmente desde los endpoints de tipo
    this.comandaService.getConteoIncidencias()
      .pipe(
        catchError(() => {
          // Fallback: contar desde endpoints individuales
          return forkJoin({
            canceladas: this.incidenciaService.obtenerPorTipo('CANCELACION').pipe(catchError(() => of([]))),
            devueltas: this.incidenciaService.obtenerPorTipo('DEVOLUCION').pipe(catchError(() => of([])))
          }).pipe(
            switchMap(({ canceladas, devueltas }) =>
              of({ canceladas: canceladas.length, devueltas: devueltas.length })
            )
          );
        })
      )
      .subscribe({
        next: (conteo) => {
          this.estadisticas.update(s => ({
            ...s,
            cancelados: conteo.canceladas,
            devueltos: conteo.devueltas
          }));
        },
        error: (err) => console.error('Error cargando conteo de incidencias', err)
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
  modalTipo = signal<'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION' | 'LISTAS'>('CANCELACION');
  incidencias = signal<AuditoriaIncidencia[]>([]);
  cargando = signal(false);

  busquedaModal = signal('');
  fechaInicioEliminar = signal('');
  fechaFinEliminar = signal('');

  // ── Modal de Confirmación Personalizado ─────────────────────────────────────
  confirmModalAbierto = signal(false);
  confirmTitulo = signal('');
  confirmMensaje = signal('');
  confirmAccion = signal<ConfirmAction>('info');
  confirmPayload = signal<any>(null);

  get minDateAnioActual(): string {
    // Permite eliminar desde 2023 en adelante.
    return '2023-01-01';
  }

  get maxDateAnioActual(): string {
    // Tope = año actual. Al cambiar de año se extiende automáticamente.
    const year = new Date().getFullYear();
    return `${year}-12-31`;
  }

  incidenciasFiltradas = computed(() => {
    const term = this.busquedaModal().toLowerCase();
    const list = this.incidencias();
    if (!term) return list;
    return list.filter(inc => {
       const mesa = (inc.comanda.numeroMesa ?? inc.comanda.mesa?.numeroMesa ?? '').toString();
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
      'CANCELACION': 'Pedidos Cancelados - Cocina',
      'DEVOLUCION': 'Pedidos Devueltos - Cocina',
      'MODIFICACION': 'Pedidos Modificados - Cocina',
      'LISTAS': 'Todas las Comandas Listas'
    };

    this.modalTipo.set(tipo as any);
    this.modalTitulo.set(titulos[tipo]);
    this.modalAbierto.set(true);
    this.busquedaModal.set('');

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

    // Llamada real al backend
    this.incidenciaService.obtenerPorTipo(tipo as 'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION')
      .pipe(
        catchError(() => {
          // Sin datos de ejemplo: si el backend no responde, mostramos vacío (datos reales).
          return of([] as AuditoriaIncidencia[]);
        })
      )
      .subscribe({
        next: (data) => {
          this.incidencias.set(data);
          this.cargando.set(false);

          // Actualizar el conteo real en las estadísticas
          this.estadisticas.update(s => {
            if (tipo === 'CANCELACION') return { ...s, cancelados: data.length };
            if (tipo === 'DEVOLUCION') return { ...s, devueltos: data.length };
            return s;
          });
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
    this.busquedaModal.set('');
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

  // ── Acciones con confirmación personalizada ──────────────────────────────────

  eliminarComandaIndividual(id: string) {
    this.confirmTitulo.set('¿Eliminar comanda?');
    this.confirmMensaje.set(`Esta acción no se puede deshacer. La comanda <strong>#${id.slice(0, 8).toUpperCase()}</strong> será eliminada permanentemente del sistema.`);
    this.confirmAccion.set('eliminar-individual');
    this.confirmPayload.set(id);
    this.confirmModalAbierto.set(true);
  }

  eliminarPorRango() {
    const inicio = this.fechaInicioEliminar();
    const fin = this.fechaFinEliminar();

    if (!inicio || !fin) {
      this.confirmTitulo.set('Fechas requeridas');
      this.confirmMensaje.set('Por favor selecciona <strong>ambas fechas</strong> para definir el rango de eliminación.');
      this.confirmAccion.set('info');
      this.confirmPayload.set(null);
      this.confirmModalAbierto.set(true);
      return;
    }

    this.confirmTitulo.set('¿Eliminar comandas en rango?');
    this.confirmMensaje.set(`Esta acción eliminará permanentemente <strong>TODAS las comandas listas</strong> entre el <strong>${inicio}</strong> y el <strong>${fin}</strong>. Esta acción no se puede deshacer.`);
    this.confirmAccion.set('eliminar-rango');
    this.confirmPayload.set({ inicio, fin });
    this.confirmModalAbierto.set(true);
  }

  confirmarAccion() {
    const accion = this.confirmAccion();
    const payload = this.confirmPayload();
    this.confirmModalAbierto.set(false);

    if (accion === 'eliminar-individual') {
      this.ejecutarEliminarIndividual(payload);
    } else if (accion === 'eliminar-rango') {
      this.ejecutarEliminarRango(payload.inicio, payload.fin);
    }
  }

  cancelarConfirm() {
    this.confirmModalAbierto.set(false);
    this.confirmPayload.set(null);
  }

  private ejecutarEliminarIndividual(id: string) {
    const tipo = this.modalTipo();

    // Cancelados / Devueltos → borra la incidencia (y su comanda) en el backend.
    if (tipo === 'CANCELACION' || tipo === 'DEVOLUCION') {
      this.comandaService.eliminarIncidencia(id).subscribe({
        next: () => {
          this.incidencias.update(list => list.filter(i => i.idAuditoria !== id));
          this.estadisticas.update(s => tipo === 'CANCELACION'
            ? { ...s, cancelados: Math.max(0, s.cancelados - 1) }
            : { ...s, devueltos: Math.max(0, s.devueltos - 1) });
        },
        error: (err) => this.mostrarErrorEliminar(err)
      });
      return;
    }

    // Listas → borra la comanda lista.
    this.comandaService.eliminarComandaPorId(id).subscribe({
      next: () => {
        this.incidencias.update(list => list.filter(i => i.idAuditoria !== id));
        this.todasListas = this.todasListas.filter(c => c.idComanda !== id);
        this.estadisticas.update(s => ({ ...s, completados: Math.max(0, s.completados - 1) }));
      },
      error: (err) => this.mostrarErrorEliminar(err)
    });
  }

  private mostrarErrorEliminar(err: unknown) {
    console.error('Error eliminando:', err);
    this.confirmTitulo.set('Error al eliminar');
    this.confirmMensaje.set('No se pudo eliminar. Verifica la conexión con el servidor.');
    this.confirmAccion.set('info');
    this.confirmModalAbierto.set(true);
  }

  private ejecutarEliminarRango(inicio: string, fin: string) {
    const fechaInicioISO = `${inicio}T00:00:00`;
    const fechaFinISO = `${fin}T23:59:59`;
    const tipo = this.modalTipo();
    const dInicio = new Date(inicio).getTime();
    const dFin = new Date(fin).getTime() + 86400000;

    // Cancelados / Devueltos → limpia incidencias (y sus comandas) por rango.
    if (tipo === 'CANCELACION' || tipo === 'DEVOLUCION') {
      this.comandaService.limpiarIncidencias(tipo, fechaInicioISO, fechaFinISO).subscribe({
        next: () => {
          this.incidencias.update(list => list.filter(i => {
            const t = new Date(i.fechaRegistro).getTime();
            return !(t >= dInicio && t < dFin);
          }));
          const restantes = this.incidencias().length;
          this.estadisticas.update(s => tipo === 'CANCELACION'
            ? { ...s, cancelados: restantes }
            : { ...s, devueltos: restantes });
        },
        error: (err) => this.mostrarErrorLimpiar(err)
      });
      return;
    }

    // Listas → limpia comandas listas por rango.
    this.comandaService.limpiarComandas(fechaInicioISO, fechaFinISO).subscribe({
      next: () => {
        this.incidencias.update(list => list.filter(i => {
           const t = new Date(i.fechaRegistro).getTime();
           return !(t >= dInicio && t < dFin);
        }));
        this.todasListas = this.todasListas.filter(c => {
           const t = new Date(c.horaEntrada).getTime();
           return !(t >= dInicio && t < dFin);
        });
        this.estadisticas.update(s => ({ ...s, completados: this.todasListas.length }));
      },
      error: (err) => this.mostrarErrorLimpiar(err)
    });
  }

  private mostrarErrorLimpiar(err: unknown) {
    console.error('Error al limpiar:', err);
    this.confirmTitulo.set('Error al limpiar');
    this.confirmMensaje.set('Hubo un error al intentar eliminar. Asegúrate de que el backend esté ejecutándose.');
    this.confirmAccion.set('info');
    this.confirmModalAbierto.set(true);
  }
}
