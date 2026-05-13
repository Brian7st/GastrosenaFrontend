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
  styleUrls: ['./paquete-req-detail.component.scss'],
})
export class PaqueteReqDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cerrarPanel(): void {
    // Navigate relative to the parent (detail view)
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  incluirEnPaquete(): void {
    console.log('Incluyendo requisición en paquete...');
    this.cerrarPanel();
  }
}
