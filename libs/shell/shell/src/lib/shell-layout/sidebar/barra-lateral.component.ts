import { Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideBox, LucideDynamicIcon, LucideLogOut, LucideSettings, LucideUser } from '@lucide/angular';
import { AuthService } from '@restaurant/shared/auth';
import { BarraLateralConfig } from '../../nav/nav.models';

@Component({
  selector: 'restaurant-barra-lateral',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideDynamicIcon,
    LucideBox,
    LucideSettings,
    LucideUser,
    LucideLogOut,
  ],
  templateUrl: './barra-lateral.component.html',
  styleUrls: ['./barra-lateral.component.scss'],
})
export class BarraLateralComponent {
  private readonly authService = inject(AuthService);

  @Input() config: BarraLateralConfig = {
    titulo: 'Mi App',
    subtitulo: '',
    logoUrl: '',
    grupos: [],
  };

  protected readonly itemsAbiertos = signal<Set<string>>(new Set());

  protected readonly visibleGroups = computed(() => {
    const currentRole = this.authService.currentUser()?.rol;

    return this.config.grupos
      .map(grupo => ({
        ...grupo,
        items: grupo.items.filter(item => !item.roles?.length || !!currentRole && item.roles.includes(currentRole)),
      }))
      .filter(grupo => grupo.items.length > 0);
  });

  protected toggleItem(ruta: string): void {
    this.itemsAbiertos.update(set => {
      const nuevo = new Set(set);
      if (nuevo.has(ruta)) {
        nuevo.delete(ruta);
      } else {
        nuevo.add(ruta);
      }
      return nuevo;
    });
  }

  protected estaAbierto(ruta: string): boolean {
    return this.itemsAbiertos().has(ruta);
  }
}
