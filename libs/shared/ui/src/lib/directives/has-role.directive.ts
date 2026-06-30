import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
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
  
  hasRole = input.required<Rol[]>();

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      const roles = this.hasRole();
      const shouldRender = !!user && roles.includes(user.rol);

      this.viewContainer.clear();

      if (shouldRender) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
