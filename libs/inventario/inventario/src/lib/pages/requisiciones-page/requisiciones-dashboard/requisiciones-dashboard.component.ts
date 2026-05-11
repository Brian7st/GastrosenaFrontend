import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideIconComponent,
  KpiCardComponent,
  ButtonComponent,
} from '@restaurant/shared/ui';

@Component({
  selector: 'gastro-requisiciones-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconComponent,
    KpiCardComponent,
    ButtonComponent,
  ],
  templateUrl: './requisiciones-dashboard.component.html',
  styleUrls: ['./requisiciones-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesDashboardComponent {}
