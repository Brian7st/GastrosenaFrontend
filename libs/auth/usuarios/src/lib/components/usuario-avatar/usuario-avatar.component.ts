import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'restaurant-usuario-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="usuario-avatar">{{ iniciales }}</div>`,
  styleUrl: './usuario-avatar.component.scss',
})
export class UsuarioAvatarComponent {
  @Input({ required: true }) nombre!: string;
  @Input({ required: true }) apellidos!: string;

  get iniciales(): string {
    return (this.nombre.charAt(0) + this.apellidos.charAt(0)).toUpperCase();
  }
}
