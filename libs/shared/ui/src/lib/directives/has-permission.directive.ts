import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { AuthService } from '@restaurant/shared/auth';

/**
 * Structural directive that renders its template only when the current user
 * holds at least one of the required permissions.
 *
 * Mirrors {@link HasRoleDirective} but gates by fine-grained permission strings
 * (e.g. `requisiciones:firmar`) instead of role, so the same view can show a
 * button to one role and hide it from another based on the backend's
 * `@PreAuthorize` contract surfaced through the login `permisos` list.
 *
 * Usage:
 * ```html
 * <button *hasPermission="'requisiciones:firmar'">Firmar</button>
 * <button *hasPermission="['actas:crear', 'actas:firmar']">Acta</button>
 * ```
 */
@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);
  private permissions: string[] = [];

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      const shouldRender = !!user && this.permissions.some(p => user.permisos?.includes(p));

      this.viewContainer.clear();

      if (shouldRender) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }

  @Input({ alias: 'hasPermission' })
  set hasPermission(value: string | string[]) {
    this.permissions = Array.isArray(value) ? value : [value];
  }
}
