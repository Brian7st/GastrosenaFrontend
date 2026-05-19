import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmptyStateComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-bar-menu-page',
  standalone: true,
  imports: [EmptyStateComponent],
  template: `
    <div style="padding: 2rem;">
      <restaurant-empty-state
        title="Menú"
        message="Próximamente disponible. Este módulo está en construcción."
      ></restaurant-empty-state>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPageComponent {}
