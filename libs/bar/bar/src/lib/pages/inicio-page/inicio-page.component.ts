import { Component, inject, signal, computed, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, timer, takeUntil, switchMap } from 'rxjs';
import { IncidenciaService } from '../../data-access/incidencia.service';
import { ComandaService } from '../../data-access/comanda.service';
import { AuditoriaIncidencia } from '../../models/incidencia.model';
import { ComandaBarYBarismo } from '../../models/comanda.model';
import { I18nService } from '../../i18n/i18n.service';
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
    FormsModule,
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
export class InicioPageComponent implements OnInit, OnDestroy {
  private incidenciaService = inject(IncidenciaService);
  private comandaService = inject(ComandaService);
  protected readonly i18n = inject(I18nService);
  private destroy$ = new Subject<void>();

  comandas = signal<ComandaBarYBarismo[]>([]);
  totalCancelados = signal(0);
  totalDevueltos = signal(0);

  estadisticas = computed(() => {
    const list = this.comandas();
    const activos = list.filter(c => c.estadoPreparacion === 'PENDIENTE' || c.estadoPreparacion === 'PREPARANDO').length;
    const completados = list.filter(c => c.estadoPreparacion === 'LISTO').length;
    
    return {
      activos,
      completados,
      cancelados: this.totalCancelados(),
      devueltos: this.totalDevueltos()
    };
  });

  pedidosPendientes = computed(() => {
    return this.comandas()
      .slice()
      .sort((a, b) => new Date(b.horaEntrada).getTime() - new Date(a.horaEntrada).getTime())
      .map(c => {
        let estadoKey = 'waiting';
        let clase = 'waiting';
        if (c.estadoPreparacion === 'PREPARANDO') {
          estadoKey = 'preparing';
          clase = 'preparing';
        } else if (c.estadoPreparacion === 'LISTO') {
          estadoKey = 'ready';
          clase = 'ready';
        }

        const platos = c.items && c.items.length > 0
          ? c.items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ')
          : c.preparacion || this.i18n.t('inicio.no-drinks');

        const tiempo = this.calcularTiempoTranscurrido(c.horaEntrada);

        return {
          mesa: c.numeroMesa.toString(),
          estado: this.i18n.t(`inicio.status.${estadoKey}`),
          platos,
          tiempo,
          clase
        };
      })
      .slice(0, 5);
  });

  fechaActual = computed(() => {
    const locale = this.i18n.currentLang() === 'en' ? 'en-US' : 'es-ES';
    return new Date().toLocaleDateString(locale, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  });

  // Modal de incidencias
  modalAbierto = signal(false);
  modalTitulo = signal('');
  modalTipo = signal<'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION'>('CANCELACION');
  incidencias = signal<AuditoriaIncidencia[]>([]);
  cargando = signal(false);

  // Modal Comandas Listas
  modalListasAbierto = signal(false);
  cargandoListas = signal(false);
  busquedaListas = signal('');
  fechaEliminarDesde = signal('');
  fechaEliminarHasta = signal('');
  mensajeEliminar = signal('');

  comandasListas = computed(() =>
    this.comandas().filter(c => c.estadoPreparacion === 'LISTO')
  );

  comandasListasFiltradas = computed(() => {
    const q = this.busquedaListas().toLowerCase().trim();
    if (!q) return this.comandasListas();
    return this.comandasListas().filter(c =>
      String(c.idComanda).toLowerCase().includes(q) ||
      String(c.numeroMesa).includes(q) ||
      (c.mesero || '').toLowerCase().includes(q) ||
      (c.preparacion || '').toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    timer(0, 5000).pipe(
      switchMap(() => this.comandaService.listarComandas()),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => this.comandas.set(data),
      error: (err) => console.error('Error loading comandas for dashboard:', err)
    });
    this.cargarIncidenciasCounts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarIncidenciasCounts(): void {
    this.incidenciaService.obtenerPorTipo('CANCELACION').subscribe({
      next: (data) => this.totalCancelados.set(data.length),
      error: (err) => console.error('Error loading cancelaciones count:', err)
    });
    this.incidenciaService.obtenerPorTipo('DEVOLUCION').subscribe({
      next: (data) => this.totalDevueltos.set(data.length),
      error: (err) => console.error('Error loading devoluciones count:', err)
    });
  }

  calcularTiempoTranscurrido(horaEntrada: string): string {
    if (!horaEntrada) return '—';
    const entrada = new Date(horaEntrada);
    const ahora = new Date();
    const diffMs = ahora.getTime() - entrada.getTime();
    const diffMins = Math.max(0, Math.floor(diffMs / 60000));
    
    if (diffMins < 1) return this.i18n.t('inicio.date.just-now');
    return `${diffMins} ${this.i18n.t('inicio.date.minutes')}`;
  }

  abrirModal(tipo: 'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION') {
    const keys: Record<string, string> = {
      'CANCELACION': 'inicio.modal.cancelled-title',
      'DEVOLUCION': 'inicio.modal.returned-title',
      'MODIFICACION': 'inicio.modal.modified-title'
    };

    this.modalTipo.set(tipo);
    this.modalTitulo.set(this.i18n.t(keys[tipo]));
    this.modalAbierto.set(true);
    this.cargando.set(true);

    this.incidenciaService.obtenerPorTipo(tipo).subscribe({
      next: (data) => {
        this.incidencias.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error fetching incidences:', err);
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

  abrirModalListas() {
    this.busquedaListas.set('');
    this.fechaEliminarDesde.set('');
    this.fechaEliminarHasta.set('');
    this.modalListasAbierto.set(true);
    // Refrescar datos reales
    this.cargandoListas.set(true);
    this.comandaService.listarComandas().subscribe({
      next: (data) => {
        this.comandas.set(data);
        this.cargandoListas.set(false);
      },
      error: (err) => {
        console.error('Error refreshing comandas for listas modal:', err);
        this.cargandoListas.set(false);
      }
    });
  }

  cerrarModalListas() {
    this.modalListasAbierto.set(false);
  }

  cerrarListasConOverlay(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrarModalListas();
    }
  }

  eliminarPorRango() {
    const desde = this.fechaEliminarDesde();
    const hasta = this.fechaEliminarHasta();
    if (!desde || !hasta) {
      this.mensajeEliminar.set(this.i18n.t('inicio.message.select-dates'));
      return;
    }

    const desdeDate = new Date(desde + 'T00:00:00');
    const hastaDate = new Date(hasta + 'T23:59:59');

    this.comandaService.limpiarComandas(desde, hasta).subscribe({
      next: () => {
        const restantes = this.comandas().filter(c => {
          const fecha = new Date(c.horaEntrada);
          return !(fecha >= desdeDate && fecha <= hastaDate && c.estadoPreparacion === 'LISTO');
        });
        const antes = this.comandasListas().length;
        const eliminadas = antes - restantes.filter(c => c.estadoPreparacion === 'LISTO').length;
        this.comandas.set(restantes);
        this.fechaEliminarDesde.set('');
        this.fechaEliminarHasta.set('');
        this.mensajeEliminar.set(eliminadas > 0
          ? `${this.i18n.t('inicio.message.deleted-range')} ${eliminadas} ${this.i18n.t('inicio.modal-listas.orders')}`
          : this.i18n.t('inicio.message.no-orders-range'));
        setTimeout(() => this.mensajeEliminar.set(''), 3000);
      },
      error: (err) => {
        console.error('Error al limpiar comandas:', err);
        this.mensajeEliminar.set(this.i18n.t('inicio.message.delete-error'));
        setTimeout(() => this.mensajeEliminar.set(''), 3000);
      }
    });
  }

  eliminarComanda(idComanda: string) {
    if (!confirm(this.i18n.t('inicio.confirm.delete-order') + idComanda + '?')) return;
    this.comandaService.eliminarComandaPorId(idComanda).subscribe({
      next: () => {
        const restantes = this.comandas().filter(c => c.idComanda !== idComanda);
        this.comandas.set(restantes);
        this.mensajeEliminar.set(this.i18n.t('inicio.message.order-deleted'));
        setTimeout(() => this.mensajeEliminar.set(''), 2000);
      },
      error: (err) => {
        console.error('Error al eliminar comanda:', err);
        this.mensajeEliminar.set(this.i18n.t('inicio.message.order-delete-error'));
        setTimeout(() => this.mensajeEliminar.set(''), 3000);
      }
    });
  }

  getIdCorto(idComanda: string): string {
    return String(idComanda).slice(-6).toUpperCase();
  }

  formatHora(fecha: string): string {
    if (!fecha) return '--:--';
    const d = new Date(fecha);
    const locale = this.i18n.currentLang() === 'en' ? 'en-US' : 'es-ES';
    return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }

  getEtiquetaTipo(tipo: string): string {
    const map: Record<string, string> = {
      'CANCELACION': 'inicio.modal.motive-cancellation',
      'DEVOLUCION': 'inicio.modal.motive-return',
      'MODIFICACION': 'inicio.modal.motive-modification'
    };
    return this.i18n.t(map[tipo] || 'inicio.modal.motive-default');
  }

  getBadgeVariant(clase: string): 'success' | 'warning' | 'danger' | 'info' {
    if (clase === 'preparing') return 'warning';
    if (clase === 'ready') return 'success';
    return 'info';
  }
}
