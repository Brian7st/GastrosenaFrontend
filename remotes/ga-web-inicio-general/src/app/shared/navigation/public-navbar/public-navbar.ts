import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './public-navbar.html',
  styleUrl: './public-navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicNavbarComponent {
  isScrolled = signal(false);
  mobileOpen = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 60);
  }

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
