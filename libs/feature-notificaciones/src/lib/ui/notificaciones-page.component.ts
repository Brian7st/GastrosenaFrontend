import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmptyStateComponent, PageHeaderComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-notificaciones-page',
  standalone: true,
  imports: [PageHeaderComponent, EmptyStateComponent],
  template: `
    <restaurant-page-header
      title="Notificaciones"
      subtitle="Panel, historial y alertas en tiempo real."
    ></restaurant-page-header>

    <restaurant-empty-state
      title="Base del dominio creada"
      message="Esta librería ya existe con la estructura oficial del monorepo. El siguiente paso es migrar la implementación legacy respetando los boundaries."
    ></restaurant-empty-state>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificacionesPageComponent {}
