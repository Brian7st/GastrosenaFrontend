import { Component, Input, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideBell, LucideBrainCircuit, LucideMoon, LucideSearch, LucideSun, LucideUser } from '@lucide/angular';
import { PerfilConfig, TopNavLink } from '../../nav/nav.models';
import { NotificacionesService } from '@restaurant/notificaciones';
import { AlertasContadorService } from '@restaurant/inventario';
import { forkJoin, of, catchError } from 'rxjs';
import { I18nService } from '../../i18n/i18n.service';
import { ThemeService } from '../../services/theme.service';
import { AsistenteUiService } from '../asistente/asistente-ui.service';

@Component({
  selector: 'restaurant-barra-superior',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideBell, LucideBrainCircuit, LucideMoon, LucideSearch, LucideSun, LucideUser],
  templateUrl: './barra-superior.component.html',
  styleUrls: ['./barra-superior.component.scss'],
})
export class BarraSuperiorComponent implements OnInit, OnDestroy {
  @Input() perfil: PerfilConfig = {};
  @Input() buscarPlaceholder = '';
  @Input() enlaces: TopNavLink[] = [];

  protected readonly i18n = inject(I18nService);
  readonly contadorNotificaciones = signal(0);

  private readonly themeService = inject(ThemeService);
  protected readonly asistente  = inject(AsistenteUiService);
  private readonly notificacionesService = inject(NotificacionesService);
  private readonly alertasContadorService = inject(AlertasContadorService);
  private intervalId: ReturnType<typeof setInterval> | undefined;

  readonly esOscuro = this.themeService.esOscuro;

  alternarTema(): void {
    this.themeService.alternar();
  }

  ngOnInit() {
    this.cargarContador();
    // Actualizar cada 30 segundos
    this.intervalId = setInterval(() => this.cargarContador(), 30000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  cargarContador() {
    // Badge agregado: notificaciones genéricas no leídas + alertas de stock activas.
    forkJoin({
      noLeidas: this.notificacionesService.contarNoLeidas().pipe(
        catchError(() => of({ count: 0 })),
      ),
      alertas: this.alertasContadorService.contarActivas().pipe(
        catchError(() => of(0)),
      ),
    }).subscribe({
      next: ({ noLeidas, alertas }) => this.contadorNotificaciones.set(noLeidas.count + alertas),
      error: () => this.contadorNotificaciones.set(0),
    });
  }
}