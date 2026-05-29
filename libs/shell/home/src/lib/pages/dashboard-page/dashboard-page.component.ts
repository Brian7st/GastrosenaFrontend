import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import {
  LucideDynamicIcon,
  LucideUtensils,
  LucideLayoutGrid,
  LucideLayoutDashboard,
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
  LucideClock,
  LucideFlame,
  LucideTrendingUp,
  LucideActivity,
  LucideDollarSign,
  LucidePieChart,
  LucideLoader,
  LucideInbox,
  LucideWifiOff,
  provideLucideIcons,
} from '@lucide/angular';
import { DashboardService } from '../../data-access/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LucideDynamicIcon, DecimalPipe, CurrencyPipe],
  providers: [
    provideLucideIcons(
      LucideUtensils,
      LucideLayoutGrid,
      LucideLayoutDashboard,
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
      LucideClock,
      LucideFlame,
      LucideTrendingUp,
      LucideActivity,
      LucideDollarSign,
      LucidePieChart,
      LucideLoader,
      LucideInbox,
      LucideWifiOff,
    ),
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  protected readonly dashboard = inject(DashboardService);

  ngOnInit(): void {
    this.dashboard.loadDashboard();
  }
}
