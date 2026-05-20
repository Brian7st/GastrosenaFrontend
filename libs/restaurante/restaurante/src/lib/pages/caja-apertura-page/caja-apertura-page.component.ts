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

  baseInicialCtrl = new FormControl<number | null>(null, [Validators.required, Validators.min(0)]);
  responsable = 'Instructor Activo';

  volver() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  confirmarApertura() {
    if (this.baseInicialCtrl.valid && this.baseInicialCtrl.value !== null) {
      this.facade.abrirCaja(this.baseInicialCtrl.value, this.responsable);
      this.volver();
    }
  }
}
