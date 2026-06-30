import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'restaurant-public-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './public-navbar.component.html',
  styleUrl: './public-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicNavbarComponent {
  isScrolled = false;
  mobileOpen = false;

  @HostListener('window:scroll')
  onScroll(): void { this.isScrolled = window.scrollY > 60; }

  toggleMobile(): void { this.mobileOpen = !this.mobileOpen; }
  closeMobile():  void { this.mobileOpen = false; }
}
