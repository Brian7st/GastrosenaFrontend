import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { EmptyStateComponent, LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-cuentas-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyStateComponent, LucideIconComponent],
  templateUrl: './cuentas-page.component.html',
  styleUrl:    './cuentas-page.component.scss',
})
export class CuentasPageComponent {}
