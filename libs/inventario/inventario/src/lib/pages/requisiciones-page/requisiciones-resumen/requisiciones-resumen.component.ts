import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'gastro-requisiciones-resumen',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './requisiciones-resumen.component.html',
  styleUrls: ['./requisiciones-resumen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesResumenComponent {
  private router = inject(Router);

  close() {
    this.router.navigate(['/app/inventario/requisiciones/nueva']);
  }
}
