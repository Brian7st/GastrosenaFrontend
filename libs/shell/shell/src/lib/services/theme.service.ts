import { Injectable, computed, effect, signal } from '@angular/core';

type Tema = 'light' | 'dark';

const STORAGE_KEY = 'gastrosena-tema';

const VARS_OSCURO: Record<string, string> = {
  '--color-fondo': '#252526',
  '--color-superficie': '#1e1e1e',
  '--color-superficie-elevada': '#2d2d2d',
  '--color-superficie-contenedor-mas-bajo': '#1e1e1e',
  '--color-superficie-contenedor': '#2d2d2d',
  '--color-superficie-contenedor-bajo': '#1e1e1e',
  '--color-superficie-contenedor-alto': '#3c3c3c',
  '--color-superficie-contenedor-mas-alto': '#3c3c3c',
  '--color-superficie-variante': '#2d2d2d',
  '--color-superficie-tenue': '#2d2d2d',
  '--color-superficie-inversa': '#d4d4d4',
  '--color-superficie-brillante': '#2d2d2d',
  '--color-en-fondo': '#d4d4d4',
  '--color-en-superficie': '#d4d4d4',
  '--color-pizarra-50': '#1e1e1e',
  '--color-pizarra-100': '#252526',
  '--color-pizarra-200': '#2d2d2d',
  '--color-pizarra-300': '#3c3c3c',
  '--color-pizarra-400': '#4a4a4a',
  '--color-pizarra-500': '#5a5a5a',
  '--color-pizarra-600': '#808080',
  '--color-pizarra-700': '#969696',
  '--color-pizarra-800': '#c8c8c8',
  '--color-pizarra-900': '#d4d4d4',
  '--color-text-primary':   '#d4d4d4',
  '--color-text-secondary': '#969696',
  '--color-text-heading': '#e0e0e0',
  '--color-text-muted': '#808080',
  '--color-text-disabled': '#5a5a5a',
  '--color-surface-primary': '#1e1e1e',
  '--color-surface-secondary': '#252526',
  '--color-surface-tertiary': '#2d2d2d',
  '--color-surface-hover': '#2a2d2e',
  '--color-surface-active': '#374151',
  '--color-surface': '#1e1e1e',
  '--color-background': '#1e1e1e',
  '--color-background-soft': '#252526',
  '--color-border': '#3c3c3c',
  '--color-border-strong': '#4a4a4a',
  '--color-contorno': '#808080',
  '--color-contorno-variante': '#5a5a5a',
  '--color-borde': '#3c3c3c',
  '--color-borde-fuerte': '#4a4a4a',
  '--color-texto-primario': '#d4d4d4',
  '--color-texto-secundario': '#969696',
  '--color-texto-cabecera': '#e0e0e0',
  '--color-secundario-texto': '#969696',
  '--color-secundario': '#969696',
  '--color-secundario-contenedor': '#2d2d2d',
  '--color-en-secundario-contenedor': '#c8c8c8',
  '--color-backdrop': 'rgba(0, 0, 0, 0.6)',
  '--color-skeleton-shimmer': '#2d2d2d',
  '--color-table-row-hover': 'rgba(45, 45, 45, 0.8)',
  '--color-table-footer-bg': 'rgba(37, 37, 38, 0.3)',
  '--color-superficie-contenedor-bajo-rgb': '30, 30, 30',
  '--color-primario-rgb': '57, 169, 0',
  '--color-primario-contenedor-rgb': '57, 169, 0',
  '--color-contorno-variante-rgb': '90, 90, 90',
  '--color-error-rgb': '186, 26, 26',

  '--color-warning-bg': '#3a2e14',
  '--color-warning-text': '#fbbf24',
  '--color-warning-border': '#3c3c3c',
  '--color-warning-badge-bg': 'rgba(251, 191, 36, 0.15)',
  '--color-warning-badge-text': '#fbbf24',
  '--color-warning-interactive': '#fbbf24',
  '--color-info-bg': '#1a2a4a',
  '--color-info-text': '#60a5fa',
  '--color-info-border': '#3c3c3c',

  '--color-brand-primary-soft': '#1a2e14',
  '--color-brand-primary-strong': '#4ade80',

  '--color-warning': '#fbbf24',
  '--color-info': '#60a5fa',

  '--color-kpi-green-bg': '#1a3a1a',
  '--color-kpi-green': '#4ade80',
  '--color-kpi-blue-bg': '#1a2a3a',
  '--color-kpi-blue': '#60a5fa',
  '--color-kpi-red-bg': '#3a1a1a',
  '--color-kpi-red': '#f87171',
  '--color-kpi-orange-bg': '#3a2a1a',
  '--color-kpi-orange': '#fb923c',

  '--color-success-bg': '#1a3a1a',
  '--color-success-text': '#4ade80',
};

const VARS_CLARO: Record<string, string> = {
  '--color-fondo': '#f8fafc',
  '--color-superficie': '#ffffff',
  '--color-superficie-elevada': '#f1f5f9',
  '--color-superficie-contenedor-mas-bajo': '#ffffff',
  '--color-superficie-contenedor': '#edeeef',
  '--color-superficie-contenedor-bajo': '#f3f4f5',
  '--color-superficie-contenedor-alto': '#e7e8e9',
  '--color-superficie-contenedor-mas-alto': '#e1e3e4',
  '--color-superficie-variante': '#e1e3e4',
  '--color-superficie-tenue': '#d9dadb',
  '--color-superficie-inversa': '#2e3132',
  '--color-superficie-brillante': '#f8f9fa',
  '--color-en-fondo': '#191c1d',
  '--color-en-superficie': '#191c1d',
  '--color-pizarra-50': '#f8fafc',
  '--color-pizarra-100': '#f1f5f9',
  '--color-pizarra-200': '#e2e8f0',
  '--color-pizarra-300': '#cbd5e1',
  '--color-pizarra-400': '#94a3b8',
  '--color-pizarra-500': '#64748b',
  '--color-pizarra-600': '#475569',
  '--color-pizarra-700': '#334155',
  '--color-pizarra-800': '#1e293b',
  '--color-pizarra-900': '#0f172a',
  '--color-text-primary':   '#191c1d',
  '--color-text-secondary': '#64748b',
  '--color-text-heading': '#111827',
  '--color-text-muted': '#6b7280',
  '--color-text-disabled': '#b2bec3',
  '--color-surface-primary': '#ffffff',
  '--color-surface-secondary': '#f8f9fa',
  '--color-surface-tertiary': '#f1f3f5',
  '--color-surface-hover': '#f3f4f6',
  '--color-surface-active': '#1e293b',
  '--color-surface': '#ffffff',
  '--color-background': '#f8fafc',
  '--color-background-soft': '#f1f5f9',
  '--color-border': '#dee2e6',
  '--color-border-strong': '#adb5bd',
  '--color-contorno': '#6e7b6b',
  '--color-contorno-variante': '#bdcab9',
  '--color-borde': '#e2e8f0',
  '--color-borde-fuerte': '#cbd5e1',
  '--color-texto-primario': '#0f172a',
  '--color-texto-secundario': '#475569',
  '--color-texto-cabecera': '#020617',
  '--color-secundario-texto': '#64748b',
  '--color-secundario': '#575f67',
  '--color-secundario-contenedor': '#d8e1ea',
  '--color-en-secundario-contenedor': '#5b646b',
  '--color-backdrop': 'rgba(15, 23, 42, 0.45)',
  '--color-skeleton-shimmer': '#f8fbf6',
  '--color-table-row-hover': 'rgba(248, 250, 252, 0.8)',
  '--color-table-footer-bg': 'rgba(248, 250, 252, 0.3)',
  '--color-superficie-contenedor-bajo-rgb': '243, 244, 245',
  '--color-primario-rgb': '57, 169, 0',
  '--color-primario-contenedor-rgb': '57, 169, 0',
  '--color-contorno-variante-rgb': '189, 202, 185',
  '--color-error-rgb': '186, 26, 26',

  '--color-warning-bg': '#fffbeb',
  '--color-warning-text': '#92400e',
  '--color-warning-border': '#fde68a',
  '--color-warning-badge-bg': 'rgba(253, 203, 110, 0.2)',
  '--color-warning-badge-text': '#8a5b00',
  '--color-warning-interactive': '#d97a00',
  '--color-info-bg': '#eff6ff',
  '--color-info-text': '#1e40af',
  '--color-info-border': '#bfdbfe',

  '--color-brand-primary-soft': '#e9f8dd',
  '--color-brand-primary-strong': '#2f7f00',

  '--color-warning': '#fdcb6e',
  '--color-info': '#0984e3',

  '--color-kpi-green-bg': '#f0fdf4',
  '--color-kpi-green': '#16a34a',
  '--color-kpi-blue-bg': '#eff6ff',
  '--color-kpi-blue': '#2563eb',
  '--color-kpi-red-bg': '#fef2f2',
  '--color-kpi-red': '#dc2626',
  '--color-kpi-orange-bg': '#fff7ed',
  '--color-kpi-orange': '#ea580c',

  '--color-success-bg': '#f0fdf4',
  '--color-success-text': '#166534',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly tema = signal<Tema>(this.#detectar());
  readonly esOscuro = computed(() => this.tema() === 'dark');

  readonly #aplicar = effect(() => {
    const vars = this.tema() === 'dark' ? VARS_OSCURO : VARS_CLARO;
    const root = document.documentElement;
    for (const [prop, val] of Object.entries(vars)) {
      root.style.setProperty(prop, val);
    }
    localStorage.setItem(STORAGE_KEY, this.tema());
  });

  alternar(): void {
    this.tema.update(t => (t === 'light' ? 'dark' : 'light'));
  }

  #detectar(): Tema {
    const guardado = localStorage.getItem(STORAGE_KEY) as Tema | null;
    if (guardado === 'dark' || guardado === 'light') return guardado;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
