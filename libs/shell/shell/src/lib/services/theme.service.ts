import { Injectable, computed, effect, signal } from '@angular/core';

type Tema = 'light' | 'dark';

const STORAGE_KEY = 'gastrosena-tema';

const VARS_OSCURO: Record<string, string> = {
  '--color-superficie-contenedor-mas-bajo': '#1e293b',
  '--color-superficie-contenedor':          '#334155',
  '--color-superficie-contenedor-bajo':     '#1e293b',
  '--color-superficie-contenedor-alto':     '#475569',
  '--color-superficie-contenedor-mas-alto': '#475569',
  '--color-superficie':                     '#1e293b',
  '--color-superficie-variante':            '#334155',
  '--color-fondo':                          '#0f172a',
  '--color-en-fondo':                       '#f1f5f9',
  '--color-en-superficie':                  '#f1f5f9',
  '--color-pizarra-50':  '#1e293b',
  '--color-pizarra-100': '#334155',
  '--color-pizarra-200': '#475569',
  '--color-pizarra-300': '#64748b',
  '--color-pizarra-400': '#94a3b8',
  '--color-pizarra-500': '#94a3b8',
  '--color-pizarra-600': '#cbd5e1',
  '--color-pizarra-700': '#e2e8f0',
  '--color-text-primary':   '#f1f5f9',
  '--color-text-secondary': '#94a3b8',
};

const VARS_CLARO: Record<string, string> = {
  '--color-superficie-contenedor-mas-bajo': '#ffffff',
  '--color-superficie-contenedor':          '#edeeef',
  '--color-superficie-contenedor-bajo':     '#f3f4f5',
  '--color-superficie-contenedor-alto':     '#e7e8e9',
  '--color-superficie-contenedor-mas-alto': '#e1e3e4',
  '--color-superficie':                     '#f8f9fa',
  '--color-superficie-variante':            '#e1e3e4',
  '--color-fondo':                          '#f8f9fa',
  '--color-en-fondo':                       '#191c1d',
  '--color-en-superficie':                  '#191c1d',
  '--color-pizarra-50':  '#f8fafc',
  '--color-pizarra-100': '#f1f5f9',
  '--color-pizarra-200': '#e2e8f0',
  '--color-pizarra-300': '#cbd5e1',
  '--color-pizarra-400': '#94a3b8',
  '--color-pizarra-500': '#64748b',
  '--color-pizarra-600': '#475569',
  '--color-pizarra-700': '#334155',
  '--color-text-primary':   '#191c1d',
  '--color-text-secondary': '#64748b',
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
