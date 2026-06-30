import { ChangeDetectionStrategy, Component, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  ButtonComponent,
  DataTableComponent,
  KpiCardComponent,
  StatusBadgeComponent,
  LucideIconComponent
} from '@restaurant/shared/ui';
import { AprobarSolicitudModalComponent } from '../../../components/aprobar-solicitud-modal/aprobar-solicitud-modal.component';
import { RechazarSolicitudModalComponent } from '../../../components/rechazar-solicitud-modal/rechazar-solicitud-modal.component';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';
import { SolicitudSesion } from '../../../models/solicitud-sesion.model';
import { EmptyStateComponent } from '../../../components/empty-state/empty-state.component';
import { AuthService } from '@restaurant/shared/auth';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'app-solicitudes-insumos-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    DataTableComponent,
    KpiCardComponent,
    StatusBadgeComponent,
    LucideIconComponent,
    AprobarSolicitudModalComponent,
    RechazarSolicitudModalComponent,
    EmptyStateComponent,
  ],
  templateUrl: './solicitudes-insumos-list.component.html',
  styleUrls: ['./solicitudes-insumos-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesInsumosListComponent implements OnInit {
  private router  = inject(Router);
  protected readonly i18n = inject(I18nService);
  private auth    = inject(AuthService);
  readonly facade = inject(SolicitudesFacade);

  /** Id del usuario autenticado que aprueba/rechaza (auditoría). */
  private get aprobadorId(): string | null {
    return this.auth.currentUser()?.id ?? null;
  }

  paginasSesion = computed(() =>
    Array.from({ length: this.facade.paginacionSesion().totalPages }, (_, i) => i)
  );

  // ─── KPIs calculados desde datos reales ───────────────────────────
  // Valid states: CREADA | APROBADA | RECHAZADA | COMPROMETIDA (EstadoSolicitudSesion)
  totalCreadasPendientes = computed(() =>
    this.facade.solicitudesSesion().filter(s => s.estado === 'CREADA').length
  );
  totalAprobadasHoy = computed(() =>
    this.facade.solicitudesSesion().filter(s => s.estado === 'APROBADA').length
  );
  totalRechazadas = computed(() =>
    this.facade.solicitudesSesion().filter(s => s.estado === 'RECHAZADA').length
  );
  totalComprometidas = computed(() =>
    this.facade.solicitudesSesion().filter(s => s.estado === 'COMPROMETIDA').length
  );

  // ─── Opciones filtros ──────────────────────────────────────────────
  estadoOptions = [
    { value: '',              label: 'Todos los estados' },
    { value: 'CREADA',        label: 'Creada'       },
    { value: 'APROBADA',      label: 'Aprobada'     },
    { value: 'RECHAZADA',     label: 'Rechazada'    },
    { value: 'COMPROMETIDA',  label: 'Comprometida' },
  ];

  fechaOptions = [
    { value: '', label: 'Fecha (Rango)' },
  ];

  // ─── Filtros (panel colapsable) ────────────────────────────────────
  showFilters  = signal(false);
  filtroEstado = signal<string>('');
  filtrosActivos = computed(() => (this.filtroEstado() ? 1 : 0));

  onToggleFilters(): void { this.showFilters.update(v => !v); }

  // ─── Estado de los modales de aprobación / rechazo ────────────────
  solicitudSeleccionada = signal<SolicitudSesion | null>(null);
  solicitudRechazo      = signal<SolicitudSesion | null>(null);

  ngOnInit(): void {
    this.facade.cargarSolicitudesSesion();
  }

  // ─── Helpers ───────────────────────────────────────────────────────
  getInitials(nombre: string): string {
    if (!nombre) return '';
    return nombre
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  getAvatarColor(estado: string): string {
    switch (estado) {
      case 'CREADA':       return 'avatar--blue';
      case 'APROBADA':     return 'avatar--green';
      case 'RECHAZADA':    return 'avatar--red';
      case 'COMPROMETIDA': return 'avatar--green';
      default:             return 'avatar--slate';
    }
  }

  getSolicitudVariant(estado: string): 'warning' | 'success' | 'neutral' | 'danger' {
    const map: Record<string, 'warning' | 'success' | 'neutral' | 'danger'> = {
      'CREADA':       'warning',
      'APROBADA':     'success',
      'RECHAZADA':    'danger',
      'COMPROMETIDA': 'success',
    };
    return map[estado] ?? 'neutral';
  }

  // ─── Handlers ─────────────────────────────────────────────────────
  onSearch(term: string): void     { this.facade.cargarSolicitudesSesion(term ? { instructorId: term } : undefined); }
  onFilterEstado(v: string): void  {
    this.filtroEstado.set(v);
    this.facade.cargarSolicitudesSesion(v ? { estado: v } : undefined);
  }
  onFilterFecha(): void            { /* date range — pendiente */ }
  onClearFilters(): void          {
    this.filtroEstado.set('');
    this.facade.cargarSolicitudesSesion();
  }

  onView(id: string): void {
    this.router.navigate(['/app/inventario/solicitudes-insumos-page', id]);
  }

  onEdit(id: string): void {
    this.router.navigate(['/app/inventario/solicitudes-insumos-page', id, 'editar']);
  }

  onApprove(solicitud: SolicitudSesion): void {
    this.solicitudSeleccionada.set(solicitud);
  }

  onCloseModal(): void {
    this.solicitudSeleccionada.set(null);
  }

  onConfirmApprove(id: string): void {
    const aprobadorId = this.aprobadorId;
    if (!aprobadorId) return; // sin usuario autenticado no se puede atribuir la aprobación
    this.facade.aprobarSolicitudSesion(id, { aprobadorId });
    this.onCloseModal();
  }

  // ─── Rechazo (modal con motivo) ───────────────────────────────────
  onReject(solicitud: SolicitudSesion): void {
    this.solicitudRechazo.set(solicitud);
  }

  onCloseRechazo(): void {
    this.solicitudRechazo.set(null);
  }

  onConfirmReject(motivo: string): void {
    const solicitud = this.solicitudRechazo();
    const aprobadorId = this.aprobadorId;
    if (!solicitud || !aprobadorId) return;
    this.facade.rechazarSolicitudSesion(solicitud.id, { aprobadorId, motivo });
    this.onCloseRechazo();
  }

  onComprometer(id: string): void {
    this.facade.comprometerSolicitudSesion(id);
  }
}
