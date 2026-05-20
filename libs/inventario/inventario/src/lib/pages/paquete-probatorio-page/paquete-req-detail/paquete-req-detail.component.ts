import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-paquete-req-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './paquete-req-detail.component.html',
  styleUrl: './paquete-req-detail.component.scss',
})
export class PaqueteReqDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cerrarPanel(): void {
    // Navigate relative to the parent (detail view)
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  incluirEnPaquete(): void {
    // TODO(paquete-facade): llamar facade.incluirRequisicionEnPaquete(...)
    console.warn('incluirEnPaquete: pendiente integración con PaqueteFacade');
    this.cerrarPanel();
  }
}
