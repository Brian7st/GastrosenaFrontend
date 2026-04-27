import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideDynamicIcon,
  LucideUtensils,
  LucideLayoutGrid,
  LucideTriangleAlert,
  LucideReceipt,
  LucideChefHat,
  LucideWine,
  LucidePackage,
  LucideTruck,
  LucideFileText,
  LucideWallet,
  LucideClipboardList,
  LucideBarChart2,
  LucideUsers,
  LucideBell,
  LucideChevronRight,
  provideLucideIcons,
} from '@lucide/angular';
import { DashboardService } from '../../data-access/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LucideDynamicIcon],
  providers: [
    provideLucideIcons(
      LucideUtensils,
      LucideLayoutGrid,
      LucideTriangleAlert,
      LucideReceipt,
      LucideChefHat,
      LucideWine,
      LucidePackage,
      LucideTruck,
      LucideFileText,
      LucideWallet,
      LucideClipboardList,
      LucideBarChart2,
      LucideUsers,
      LucideBell,
      LucideChevronRight,
    ),
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  protected readonly dashboard = inject(DashboardService);
}
