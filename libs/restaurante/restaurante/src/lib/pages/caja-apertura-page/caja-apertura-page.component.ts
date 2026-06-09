import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  PageHeaderComponent, 
  ButtonComponent,
  LucideIconComponent
} from '@restaurant/shared/ui';
import { RestauranteFacade } from '../../data-access/restaurante.facade';

import { AuthService } from '../../data-access/auth.service';

@Component({
  selector: 'restaurant-caja-apertura-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    ButtonComponent,
    LucideIconComponent
  ],
  templateUrl: './caja-apertura-page.component.html',
  styleUrl: './caja-apertura-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaAperturaPageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  facade = inject(RestauranteFacade);
  authService = inject(AuthService);

  nombreCajero = this.authService.getUsuarioNombre();

  baseEfectivoCtrl = new FormControl<number | null>(null, [Validators.required, Validators.min(0)]);

  volver() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  confirmarApertura() {
    if (this.baseEfectivoCtrl.valid && this.baseEfectivoCtrl.value !== null) {
      this.facade.abrirCaja(this.baseEfectivoCtrl.value);
      this.volver();
    }
  }

preventInvalidChars(event: KeyboardEvent): void {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }
}
