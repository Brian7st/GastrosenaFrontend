import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'gastro-requisiciones-firmar',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './requisiciones-firmar.component.html',
  styleUrls: ['./requisiciones-firmar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesFirmarComponent {
  private router = inject(Router);

  close() {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
