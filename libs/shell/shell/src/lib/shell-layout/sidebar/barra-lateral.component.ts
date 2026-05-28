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

  readonly expandedItems = signal(new Set<string>());

  protected readonly visibleGroups = computed(() => {
    const currentUser = this.authService.currentUser();
    const currentRole = currentUser?.rol;
    const permisos = currentUser?.permisos ?? [];

    return this.config.grupos
      .map(grupo => ({
        ...grupo,
        items: grupo.items.filter(item => {
          // Filtrar por rol si tiene roles definidos
          if (item.roles?.length && (!currentRole || !item.roles.includes(currentRole))) {
            return false;
          }
          // Filtrar por permisos si tiene permisos definidos
          if (item.permisos?.length) {
            return item.permisos.some(p => permisos.includes(p));
          }
          // Si no tiene restricciones, mostrar siempre
          return true;
        }),
      }))
      .filter(grupo => grupo.items.length > 0);
  });

  toggleItem(ruta: string): void {
    this.expandedItems.update(current => {
      const next = new Set(current);
      if (next.has(ruta)) {
        next.delete(ruta);
      } else {
        next.add(ruta);
      }
      return next;
    });
  }

  isExpanded(ruta: string): boolean {
    return this.expandedItems().has(ruta);
  }
}