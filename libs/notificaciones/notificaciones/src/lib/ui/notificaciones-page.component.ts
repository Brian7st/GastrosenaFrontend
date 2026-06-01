import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificacionesService } from '../data-access/notificaciones.service';
import { Notificacion } from '../models/notificaciones.model';
import {
  PageHeaderComponent,
  StatusBadgeComponent,
  LucideIconComponent,
  ButtonComponent,
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-notificaciones-page',
  standalone: true,
  imports: [DatePipe, PageHeaderComponent, StatusBadgeComponent, LucideIconComponent, ButtonComponent],
  templateUrl: './notificaciones-page.component.html',
  styleUrls: ['./notificaciones-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificacionesPageComponent implements OnInit {
  private notificacionesService = inject(NotificacionesService);

  notificaciones = signal<Notificacion[]>([]);
  loading = signal(false);
  noLeidas = signal(0);

  ngOnInit() {
    this.cargarNotificaciones();
    this.contarNoLeidas();
  }

  cargarNotificaciones() {
    this.loading.set(true);
    this.notificacionesService.obtenerNotificaciones().subscribe({
      next: (resp) => {
        this.notificaciones.set(resp.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  contarNoLeidas() {
    this.notificacionesService.contarNoLeidas().subscribe({
      next: (r) => this.noLeidas.set(r.count)
    });
  }

  marcarComoLeida(id: string) {
    this.notificacionesService.marcarComoLeida(id).subscribe(() => {
      this.cargarNotificaciones();
      this.contarNoLeidas();
    });
  }

  marcarTodasLeidas() {
    this.notificacionesService.marcarTodasComoLeidas().subscribe(() => {
      this.cargarNotificaciones();
      this.contarNoLeidas();
    });
  }

  getTipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      BLOQUEO: 'Bloqueo',
      RESTABLECIMIENTO: 'Restablecimiento',
      CAMBIO_CONTRASENA: 'Cambio',
      REGISTRO: 'Registro',
    };
    return labels[tipo] || tipo;
  }
}