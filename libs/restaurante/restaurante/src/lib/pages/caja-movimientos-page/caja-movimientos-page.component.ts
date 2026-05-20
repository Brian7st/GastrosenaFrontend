import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  PageHeaderComponent, 
  ButtonComponent,
  LucideIconComponent
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-caja-movimientos-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ButtonComponent,
    LucideIconComponent
  ],
  templateUrl: './caja-movimientos-page.component.html',
  styleUrl: './caja-movimientos-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaMovimientosPageComponent {
  private router = inject(Router);

  volver() {
    this.router.navigate(['/app/restaurante/caja']);
  }
}
