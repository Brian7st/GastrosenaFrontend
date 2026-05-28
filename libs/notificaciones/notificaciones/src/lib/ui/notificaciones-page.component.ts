import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  PageHeaderComponent,
  SelectFilterComponent,
  StatusBadgeComponent,
  LucideIconComponent,
  ButtonComponent,
} from '@restaurant/shared/ui';
import { NotificacionesFacade } from '../data-access/notificaciones.facade';
import { Notificacion, TipoNotificacion } from '../models/notificaciones.model';

@Component({
  selector: 'restaurant-notificaciones-page',
  standalone: true,
  imports: [
    DatePipe,
    PageHeaderComponent,
    SelectFilterComponent,
    StatusBadgeComponent,
    LucideIconComponent,
    ButtonComponent,
  ],
  templateUrl: './notificaciones-page.component.html',
  styleUrl: './notificaciones-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificacionesPageComponent implements OnInit {
  private readonly facade = inject(NotificacionesFacade);

  readonly filtroEstado = signal<string>('todas');
  readonly filtroTipo = signal<string>('todos');
  readonly notificacionSeleccionada = signal<Notificacion | null>(null);

  // ── Estado del facade ─────────────────────────────────────────────────────
  readonly cargando = this.facade.cargando;
  readonly error    = this.facade.error;
  readonly noLeidas = this.facade.noLeidas;

  readonly estadoOpciones = [
    { label: 'Todas',     value: 'todas'    },
    { label: 'No leídas', value: 'no_leida' },
    { label: 'Leídas',    value: 'leida'    },
  ];

  readonly tipoOpciones = [
    { label: 'Todos los tipos',               value: 'todos'                      },
    { label: 'Bloqueo de cuenta',             value: 'bloqueo_cuenta'             },
    { label: 'Restablecimiento de contraseña',value: 'restablecimiento_contrasena'},
    { label: 'Cambio de contraseña',          value: 'cambio_contrasena'          },
    { label: 'Registro de usuario',           value: 'registro_usuario'           },
    { label: 'Alerta de stock',               value: 'alerta_stock'               },
    { label: 'General',                       value: 'general'                    },
  ];

  readonly notificacionesFiltradas = computed(() => {
    const estado = this.filtroEstado();
    const tipo   = this.filtroTipo();

    return this.facade.notificaciones()
      .filter(n => estado === 'todas' || n.estado === estado)
      .filter(n => tipo === 'todos'   || n.tipo   === tipo)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  });

  ngOnInit(): void {
    this.facade.cargarNotificaciones();
  }

  seleccionarNotificacion(n: Notificacion): void {
    this.notificacionSeleccionada.set(n);
    this.facade.marcarComoLeida(n.id);
  }

  cerrarDetalle(): void {
    this.notificacionSeleccionada.set(null);
  }

  marcarTodasLeidas(): void {
    this.facade.marcarTodasLeidas();
  }

  getTipoLabel(tipo: TipoNotificacion): string {
    const labels: Record<TipoNotificacion, string> = {
      bloqueo_cuenta:              'Bloqueo',
      restablecimiento_contrasena: 'Restablecimiento',
      cambio_contrasena:           'Cambio contraseña',
      registro_usuario:            'Registro',
      alerta_stock:                'Stock',
      pedido:                      'Pedido',
      general:                     'General',
    };
    return labels[tipo] ?? tipo;
  }
}