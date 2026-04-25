import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { SanitizerService } from '../../../shared/services/sanitizer.service';
import { SafeHtml } from '@angular/platform-browser';

interface NavItem {
  label: string;
  route: string;
  icon:  SafeHtml;
  badge?: number;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit {
  collapsed   = false;
  userName    = 'Usuario';
  userRole    = 'Rol';
  userInitial = 'U';
  navItems: NavItem[] = [];

  constructor(private auth: AuthService, private san: SanitizerService) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (user) {
      this.userName    = user.nombreCompleto;
      this.userRole    = user.rol;
      this.userInitial = user.nombreCompleto.charAt(0).toUpperCase();
    }

    this.navItems = [
      { label: 'Inicio',              route: '/dashboard',            exact: true, icon: this.san.safe(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>`) },
      { label: 'Gestión de Usuarios', route: '/dashboard/usuarios',   icon: this.san.safe(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/></svg>`) },
      { label: 'Restaurante',         route: '/dashboard/restaurante', icon: this.san.safe(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>`) },
      { label: 'Cocina',              route: '/dashboard/cocina',      badge: 5, icon: this.san.safe(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2a10 10 0 100 20"/><path d="M12 6v6l4 2"/></svg>`) },
      { label: 'Bar',                 route: '/dashboard/bar',         icon: this.san.safe(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 22h8M12 11v11M3 3h18l-4 8H7L3 3z"/></svg>`) },
      { label: 'Inventario',          route: '/dashboard/inventario',  badge: 2, icon: this.san.safe(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>`) },
      { label: 'Reportes',            route: '/dashboard/reportes',    icon: this.san.safe(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`) }
    ];
  }

  logout(): void { this.auth.logout(); }
}
