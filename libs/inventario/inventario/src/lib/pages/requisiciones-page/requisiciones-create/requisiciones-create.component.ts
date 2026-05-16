import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

@Component({
  selector: 'gastro-requisiciones-create',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent, BackButtonComponent],
  templateUrl: './requisiciones-create.component.html',
  styleUrls: ['./requisiciones-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesCreateComponent {
  private router = inject(Router);

  toggleCategory(name: string): void {
    // TODO: Implement accordion toggle logic with signals
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
