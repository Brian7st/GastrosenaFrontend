import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'gastro-requisiciones-despacho',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './requisiciones-despacho.component.html',
  styleUrls: ['./requisiciones-despacho.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesDespachoComponent {
  private router = inject(Router);

  close() {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
