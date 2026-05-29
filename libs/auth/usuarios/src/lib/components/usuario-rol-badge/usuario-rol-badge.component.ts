import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Rol } from '@restaurant/shared/models';
import { getRolClass } from '../../util/rol-class.util';

@Component({
  selector: 'restaurant-usuario-rol-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="rol-badge rol-badge--{{ rolClass }}">{{ rol }}</span>`,
  styleUrl: './usuario-rol-badge.component.scss',
})
export class UsuarioRolBadgeComponent {
  @Input({ required: true }) rol!: Rol;

  get rolClass(): string {
    return getRolClass(this.rol);
  }
}
