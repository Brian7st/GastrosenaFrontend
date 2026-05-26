import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  PageHeaderComponent, 
  ButtonComponent,
  LucideIconComponent
} from '@restaurant/shared/ui';
import { RestauranteFacade } from '../../data-access/restaurante.facade';

@Component({
  selector: 'restaurant-caja-cierre-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    ButtonComponent,
    LucideIconComponent,
    CurrencyPipe
  ],
  templateUrl: './caja-cierre-page.component.html',
  styleUrl: './caja-cierre-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaCierrePageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  facade = inject(RestauranteFacade);

  efectivoCtrl = new FormControl<number | null>(null, [Validators.required, Validators.min(0)]);
  vouchersCtrl = new FormControl<number | null>(null, [Validators.min(0)]);

  baseInicial = computed(() => this.facade.turnoCaja()?.baseInicial || 0);
  ventasTotales = computed(() => this.facade.cajaStats().totalFacturado);
  totalEsperado = computed(() => this.baseInicial() + this.ventasTotales());

  volver() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  generarCierre() {
    if (this.efectivoCtrl.valid) {
      this.facade.cerrarCaja();
      this.volver();
    }
  }
}
