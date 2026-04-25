import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent, BarraLateralConfig, TopNavLink } from 'inventario-ui';

export const TOP_MENU: TopNavLink[] = [
  { label: 'Inventario', ruta: '/dashboard' },
  { label: 'Asignaciones', ruta: '/asignaciones' },
  { label: 'Bajas', ruta: '/bajas' }
];

export const SIDEBAR_CONFIG: BarraLateralConfig = {
  titulo: 'SENA Inventario',
  subtitulo: 'PRECISION LEDGER',
  logoUrl: '',
  grupos: [
    {
      etiqueta: '',
      items: [
        { label: 'Dashboard', ruta: '/dashboard', icono: 'layout-dashboard' },
        { label: 'Gestión de Bienes', ruta: '/bienes', icono: 'package' },
        { label: 'Facturas Electrónicas', ruta: '/facturas', icono: 'receipt' },
        { label: 'Generar GIL-F-014', ruta: '/solicitudes-gil', icono: 'file-text' },
        { label: 'Consolidado Presupuestal', ruta: '/factura-global', icono: 'file-stack' },
        { label: 'Requisición y Entradas', ruta: '/movimientos', icono: 'arrow-left-right' },
        { label: 'Alertas de Stock', ruta: '/alertas', icono: 'bell' },
        { label: 'Presupuesto', ruta: '/presupuesto', icono: 'wallet' },
        { label: 'Conciliación (Auditoría)', ruta: '/conciliacion', icono: 'scale' }
      ]
    }
  ]
};

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MainLayoutComponent],
    template: `
    <lib-main-layout
      [sidebarConfig]="sidebarConfig"
      [topMenu]="topMenuConfig"
      [perfil]="{ nombre: 'Usuario SENA', avatarUrl: '' }"
      buscarPlaceholder="Buscar bienes, facturas o alertas..."
    >
      <router-outlet></router-outlet>
    </lib-main-layout>
  `
})
export class AppComponent {
  sidebarConfig = SIDEBAR_CONFIG;
  topMenuConfig = TOP_MENU;
}
