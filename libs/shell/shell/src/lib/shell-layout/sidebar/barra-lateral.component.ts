import { Component, EventEmitter, Input, Output, computed, effect, inject, input, signal } from '@angular/core';
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

  readonly colapsada = input(false);

  @Output() readonly expandir = new EventEmitter<void>();

  readonly expandedItems = signal(new Set<string>());

  constructor() {
    effect(() => {
      if (this.colapsada()) {
        this.expandedItems.set(new Set());
      }
    });
  }

  protected readonly visibleGroups = computed(() => {
    const currentRole = this.authService.currentUser()?.rol;

    return this.config.grupos
      .map(grupo => ({
        ...grupo,
        items: grupo.items.filter(item => !item.roles?.length || !!currentRole && item.roles.includes(currentRole)),
      }))
      .filter(grupo => grupo.items.length > 0);
  });

  toggleItem(ruta: string): void {
    if (this.colapsada()) {
      this.expandir.emit();
      return;
    }
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
