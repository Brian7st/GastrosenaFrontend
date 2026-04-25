import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmptyStateComponent, PageHeaderComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-bar-page',
  standalone: true,
  imports: [PageHeaderComponent, EmptyStateComponent],
  template: `
    <restaurant-page-header
      title="Bar y Barismo"
      subtitle="Pedidos de bebidas, recetas y alertas."
    ></restaurant-page-header>

    <restaurant-empty-state
      title="Base del dominio creada"
      message="Esta librería ya existe con la estructura oficial del monorepo. El siguiente paso es migrar la implementación legacy respetando los boundaries."
    ></restaurant-empty-state>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarPageComponent {}
