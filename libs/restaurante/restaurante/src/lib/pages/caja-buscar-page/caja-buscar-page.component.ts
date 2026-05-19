import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  PageHeaderComponent, 
  CardComponent, 
  ButtonComponent,
  LucideIconComponent,
  StatusBadgeComponent
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-caja-buscar-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    LucideIconComponent,
    StatusBadgeComponent
  ],
  templateUrl: './caja-buscar-page.component.html',
  styleUrl: './caja-buscar-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaBuscarPageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mostrarModalDetalle = signal(false);
  facturaSeleccionada = signal<any>(null);

  volver() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  verDetalle(factura: any) {
    this.facturaSeleccionada.set(factura);
    this.mostrarModalDetalle.set(true);
  }

  cerrarModal() {
    this.mostrarModalDetalle.set(false);
    this.facturaSeleccionada.set(null);
  }

  irAPagar() {
    this.cerrarModal();
    this.router.navigate(['../pagar'], { relativeTo: this.route });
  }
}
