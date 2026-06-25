import { Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideBox, LucideDynamicIcon, LucideLogOut, LucideSettings, LucideUser } from '@lucide/angular';
import { AuthService } from '@restaurant/shared/auth';
import { BarraLateralConfig } from '../../nav/nav.models';
import { I18nService } from '../../i18n/i18n.service';
import { AsistenteUiService } from '../asistente/asistente-ui.service';

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
  protected readonly i18n = inject(I18nService);
  protected readonly asistente = inject(AsistenteUiService);

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

    const bypass = !currentUser || permisos.length === 0;

    const checkAccess = (element: any) => {
      if (bypass) return true;
      if (element.roles?.length && (!currentRole || !element.roles.includes(currentRole))) {
        return false;
      }
      if (element.permisos?.length) {
        return element.permisos.some((p: string) => permisos.includes(p));
      }
      return true;
    };

    return this.config.grupos
      .map(grupo => ({
        ...grupo,
        items: grupo.items
          .filter(item => checkAccess(item))
          .map(item => {
            if (!item.children) return item;
            return {
              ...item,
              children: item.children.filter(child => checkAccess(child))
            };
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