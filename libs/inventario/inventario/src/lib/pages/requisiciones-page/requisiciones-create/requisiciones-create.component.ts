import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'gastro-requisiciones-create',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
  templateUrl: './requisiciones-create.component.html',
  styleUrls: ['./requisiciones-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesCreateComponent {
  toggleCategory(name: string): void {
    // TODO: Implement accordion toggle logic with signals
  }
}
