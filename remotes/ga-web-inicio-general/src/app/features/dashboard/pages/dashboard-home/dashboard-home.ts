import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss'
})
export class DashboardHome implements OnInit {
  today    = new Date();
  userName = 'Usuario';
  userRole = 'Administrador';

  kpis: any[] = [];
  quickAccess: any[] = [];

  constructor(private auth: AuthService, private sanitizer: DomSanitizer) {}

  safe(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (user) {
      this.userName = user.nombreCompleto;
      this.userRole = user.rol;
    }

    this.kpis = [
      { label: 'Ventas Hoy',      value: '$2,450,000', trend: '+12.5% desde ayer', trendUp: true,  iconBg: 'rgba(40,167,69,.12)',  icon: this.safe(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`) },
      { label: 'Pedidos Activos', value: '15',          trend: '+3 desde ayer',    trendUp: true,  iconBg: 'rgba(59,130,246,.12)', icon: this.safe(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`) },
      { label: 'Mesas Ocupadas',  value: '8/12',        trend: '66% ocupación',    trendUp: true,  iconBg: 'rgba(245,158,11,.12)', icon: this.safe(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`) },
      { label: 'Stock Bajo',      value: '2',           trend: 'Crítico',          trendUp: false, iconBg: 'rgba(239,68,68,.10)',  icon: this.safe(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>`) }
    ];

    this.quickAccess = [
      { label: 'Ver Reportes', route: '/dashboard/reportes',   icon: this.safe(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`) },
      { label: 'Usuarios',     route: '/dashboard/usuarios',   icon: this.safe(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>`) },
      { label: 'Inventario',   route: '/dashboard/inventario', icon: this.safe(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>`) },
      { label: 'Restaurante',  route: '/dashboard/restaurante',icon: this.safe(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>`) }
    ];
  }

  recentOrders = [
    { id: 'ORD-001', status: 'Preparando', statusKey: 'preparing', table: 'Mesa 5', items: 'Pasta Carbonara, Vino Tinto',  time: '10:30' },
    { id: 'ORD-002', status: 'Listo',      statusKey: 'ready',     table: 'Mesa 2', items: 'Ensalada César, Agua',         time: '10:25' },
    { id: 'ORD-003', status: 'En Espera',  statusKey: 'waiting',   table: 'Mesa 8', items: 'Pizza Margherita, Cerveza',    time: '10:35' },
    { id: 'ORD-004', status: 'Preparando', statusKey: 'preparing', table: 'Mesa 1', items: 'Salmón Grillado, Vino Blanco', time: '10:20' }
  ];

  lowStock = [
    { name: 'Tomates',         qty: '5/20 kg', pct: 25 },
    { name: 'Aceite de Oliva', qty: '2/5 L',   pct: 40 },
    { name: 'Queso Parmesano', qty: '1/3 kg',  pct: 33 }
  ];

  recentActivity = [
    { text: 'Nuevo plato agregado al menú',    time: 'Hace 2 horas', color: '#22c55e' },
    { text: 'Usuario registrado: Ana López',   time: 'Hace 4 horas', color: '#3b82f6' },
    { text: 'Pedido de bebidas completado',    time: 'Hace 6 horas', color: '#a855f7' },
    { text: 'Inventario actualizado: Lácteos', time: 'Hace 8 horas', color: '#f59e0b' }
  ];
}
