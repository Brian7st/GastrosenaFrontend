import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../core/models/nav-item.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Panel Principal', route: '/dashboard',     icon: '⊞' },
    { label: 'Restaurante',     route: '/restaurante',   icon: '✂' },
    { label: 'Comandas',        route: '/comandas',       icon: '📋' },
    { label: 'Estadísticas',    route: '/estadisticas',  icon: '↗' },
    { label: 'Facturación',     route: '/facturacion',   icon: '🧾' },
  ];
}
