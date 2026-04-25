import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmptyStateComponent, PageHeaderComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-restaurante-page',
  standalone: true,
  imports: [PageHeaderComponent, EmptyStateComponent],
  template: `
    <restaurant-page-header
      title="Restaurante"
      subtitle="Mesas, salón, comandas y atención."
    ></restaurant-page-header>

    <restaurant-empty-state
      title="Base del dominio creada"
      message="Esta librería ya existe con la estructura oficial del monorepo. El siguiente paso es migrar la implementación legacy respetando los boundaries."
    ></restaurant-empty-state>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantePageComponent {}
