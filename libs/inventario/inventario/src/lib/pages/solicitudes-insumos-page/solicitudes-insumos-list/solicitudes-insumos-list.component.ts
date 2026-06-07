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
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';
import { SolicitudSesion } from '../../../models/solicitud-sesion.model';
import { EmptyStateComponent } from '../../../components/empty-state/empty-state.component';

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
    EmptyStateComponent,
  ],
  templateUrl: './solicitudes-insumos-list.component.html',
  styleUrls: ['./solicitudes-insumos-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesInsumosListComponent implements OnInit {
  private router  = inject(Router);
  readonly facade = inject(SolicitudesFacade);

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

  // ─── Estado del modal de aprobación ───────────────────────────────
  solicitudSeleccionada = signal<SolicitudSesion | null>(null);

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
    // TODO: replace 'current-user' with real auth context (AuthService.currentUserId)
    this.facade.aprobarSolicitudSesion(id, { aprobadorId: 'current-user' });
    this.onCloseModal();
  }

  onReject(id: string): void {
    const motivo = prompt('Motivo del rechazo:');
    if (!motivo?.trim()) return;
    // TODO: replace 'current-user' with real auth context (AuthService.currentUserId)
    this.facade.rechazarSolicitudSesion(id, {
      aprobadorId: 'current-user',
      motivo: motivo.trim(),
    });
  }

  onComprometer(id: string): void {
    this.facade.comprometerSolicitudSesion(id);
  }
}
