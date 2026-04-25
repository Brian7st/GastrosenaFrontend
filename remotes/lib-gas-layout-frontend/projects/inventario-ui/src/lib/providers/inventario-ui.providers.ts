import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  LucideIcon,
  LucideIconData,
  LucideLayoutDashboard,
  LucideList,
  LucideTriangleAlert,
  provideLucideIcons
} from '@lucide/angular';

export type InventarioUiIcon = LucideIcon | LucideIconData;

export interface ProvideInventarioUiOptions {
  /**
   * Iconos adicionales para navegación dinámica (`[lucideIcon]`) que usen los micro-frontends.
   * La librería ya registra un set base para los casos más comunes.
   */
  icons?: InventarioUiIcon[];
}

/**
 * Set base de íconos dinámicos que usa la librería y sus ejemplos oficiales.
 * Los consumidores pueden extenderlo con `options.icons` sin conocer `provideLucideIcons(...)`.
 */
export const INVENTARIO_UI_BASE_ICONS: InventarioUiIcon[] = [
  LucideLayoutDashboard,
  LucideList,
  LucideTriangleAlert
];

/**
 * Punto único de integración para micro-frontends consumidores de `inventario-ui`.
 */
export function provideInventarioUi(
  options: ProvideInventarioUiOptions = {}
): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideLucideIcons(...INVENTARIO_UI_BASE_ICONS, ...(options.icons ?? []))
  ]);
}
