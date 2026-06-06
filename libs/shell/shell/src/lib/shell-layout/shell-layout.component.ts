import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideLucideIcons, LucideMessageSquare, LucidePalette, LucideSettings2, LucideTerminal } from '@lucide/angular';
import { AuthService } from '@restaurant/shared/auth';
import { RESTAURANT_UI_BASE_ICONS } from '@restaurant/shared/ui';
import { BarraLateralComponent } from './sidebar/barra-lateral.component';
import { BarraSuperiorComponent } from './topbar/barra-superior.component';
import { SIDEBAR_CONFIG, TOP_MENU_CONFIG } from '../nav/nav-config';

@Component({
  selector: 'restaurant-shell-layout',
  standalone: true,
  imports: [RouterOutlet, BarraLateralComponent, BarraSuperiorComponent],
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideLucideIcons(
      ...RESTAURANT_UI_BASE_ICONS,
      LucideMessageSquare,
      LucidePalette,
      LucideSettings2,
      LucideTerminal,
    ),
  ],
})
export class ShellLayoutComponent {
  private readonly authService = inject(AuthService);

  protected readonly sidebarConfig = SIDEBAR_CONFIG;
  protected readonly topMenu = TOP_MENU_CONFIG;
  protected readonly currentUser = computed(() => this.authService.currentUser());
}
