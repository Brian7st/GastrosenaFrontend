import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideIconComponent,
  KpiCardComponent,
  ButtonComponent,
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-requisiciones-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconComponent,
    KpiCardComponent,
    ButtonComponent,
  ],
  templateUrl: './requisiciones-dashboard.component.html',
  styleUrl: './requisiciones-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesDashboardComponent {}
