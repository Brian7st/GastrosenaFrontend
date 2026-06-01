import { Component, Input, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideBell, LucideBrainCircuit, LucideMoon, LucideSearch, LucideSun, LucideUser } from '@lucide/angular';
import { PerfilConfig, TopNavLink } from '../../nav/nav.models';
import { NotificacionesService } from '@restaurant/notificaciones';

@Component({
  selector: 'restaurant-barra-superior',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideBell, LucideBrainCircuit, LucideMoon, LucideSearch, LucideSun, LucideUser],
  templateUrl: './barra-superior.component.html',
  styleUrls: ['./barra-superior.component.scss'],
})
export class BarraSuperiorComponent implements OnInit, OnDestroy {
  @Input() perfil: PerfilConfig = {};
  @Input() buscarPlaceholder = 'Buscar...';
  @Input() enlaces: TopNavLink[] = [];

  readonly esOscuro = signal(false);
  readonly contadorNotificaciones = signal(0);

  private notificacionesService = inject(NotificacionesService);
  private intervalId: any;

  alternarTema(): void {
    this.esOscuro.update(v => !v);
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
    this.notificacionesService.contarNoLeidas().subscribe({
      next: (res) => this.contadorNotificaciones.set(res.count),
      error: () => this.contadorNotificaciones.set(0)
    });
  }
}