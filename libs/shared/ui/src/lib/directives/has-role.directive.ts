import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { AuthService } from '@restaurant/shared/auth';
import { Rol } from '@restaurant/shared/models';

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);
  private roles: Rol[] = [];

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      const shouldRender = !!user && this.roles.includes(user.rol);

      this.viewContainer.clear();

      if (shouldRender) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }

  @Input({ alias: 'hasRole' })
  set hasRole(value: Rol[]) {
    this.roles = value;
  }
}
