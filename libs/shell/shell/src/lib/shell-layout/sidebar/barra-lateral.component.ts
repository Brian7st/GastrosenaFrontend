import { Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideBox, LucideDynamicIcon, LucideLogOut, LucideSettings, LucideUser } from '@lucide/angular';
import { AuthService } from '@restaurant/shared/auth';
import { BarraLateralConfig, NavItem } from '../../nav/nav.models';
import { Rol } from '@restaurant/shared/models';
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

    return this.config.grupos
      .map(grupo => ({
        ...grupo,
        items: this.filterItems(grupo.items, bypass, currentRole, permisos),
      }))
      .filter(grupo => grupo.items.length > 0);
  });

  /**
   * Filters nav items by role and permission, recursively pruning children.
   * A parent that declared children but ends up with none visible is hidden,
   * so a role only sees the entries the backend actually authorizes.
   */
  private filterItems(
    items: NavItem[],
    bypass: boolean,
    currentRole: Rol | undefined,
    permisos: string[],
  ): NavItem[] {
    return items
      .filter(item => this.isItemVisible(item, bypass, currentRole, permisos))
      .map(item => {
        if (!item.children?.length) return item;
        const children = this.filterItems(item.children, bypass, currentRole, permisos);
        return { ...item, children };
      })
      .filter(item => !item.children || item.children.length > 0 || bypass);
  }

  private isItemVisible(
    item: NavItem,
    bypass: boolean,
    currentRole: Rol | undefined,
    permisos: string[],
  ): boolean {
    if (bypass) return true;
    if (item.roles?.length && (!currentRole || !item.roles.includes(currentRole))) {
      return false;
    }
    if (item.permisos?.length) {
      return item.permisos.some(p => permisos.includes(p));
    }
    return true;
  }

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