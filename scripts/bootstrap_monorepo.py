from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parents[1]

files: dict[str, str] = {}


def add(path: str, content: str) -> None:
    files[path] = dedent(content).lstrip("\n")


add(
    "package.json",
    r"""
    {
      "name": "restaurant-monorepo",
      "version": "0.1.0",
      "private": true,
      "scripts": {
        "nx": "nx",
        "start": "nx serve restaurant-app",
        "lint": "nx affected:lint --base=develop",
        "test": "nx affected:test --base=develop",
        "graph": "nx graph",
        "format": "nx format:write"
      },
      "dependencies": {
        "@angular/common": "^20.3.19",
        "@angular/compiler": "^20.3.19",
        "@angular/core": "^20.3.19",
        "@angular/forms": "^20.3.19",
        "@angular/platform-browser": "^20.3.19",
        "@angular/router": "^20.3.19",
        "@ngrx/effects": "^20.0.0",
        "@ngrx/router-store": "^20.0.0",
        "@ngrx/store": "^20.0.0",
        "rxjs": "~7.8.0",
        "tslib": "^2.3.0",
        "zone.js": "~0.15.0"
      },
      "devDependencies": {
        "@angular/build": "^20.3.24",
        "@angular/cli": "^20.3.24",
        "@angular/compiler-cli": "^20.3.19",
        "@nx/angular": "^20.0.0",
        "@nx/eslint": "^20.0.0",
        "@nx/eslint-plugin": "^20.0.0",
        "@types/node": "^22.10.2",
        "eslint": "^9.18.0",
        "husky": "^9.1.7",
        "lint-staged": "^15.2.10",
        "nx": "^20.0.0",
        "prettier": "^3.4.2",
        "typescript": "~5.9.3"
      },
      "lint-staged": {
        "*.{ts,html,scss,md,json}": [
          "prettier --write"
        ]
      }
    }
    """,
)

add(
    "nx.json",
    r"""
    {
      "$schema": "./node_modules/nx/schemas/nx-schema.json",
      "namedInputs": {
        "default": ["{projectRoot}/**/*", "sharedGlobals"],
        "production": [
          "default",
          "!{projectRoot}/**/*.spec.ts",
          "!{projectRoot}/**/*.test.ts"
        ],
        "sharedGlobals": [
          "{workspaceRoot}/tsconfig.base.json",
          "{workspaceRoot}/.eslintrc.json"
        ]
      },
      "targetDefaults": {
        "build": {
          "inputs": ["production", "^production"],
          "cache": true
        },
        "lint": {
          "inputs": ["default", "^default"],
          "cache": true
        },
        "test": {
          "inputs": ["default", "^default"],
          "cache": true
        }
      },
      "workspaceLayout": {
        "appsDir": "apps",
        "libsDir": "libs"
      },
      "defaultProject": "restaurant-app"
    }
    """,
)

add(
    "tsconfig.base.json",
    r"""
    {
      "compileOnSave": false,
      "compilerOptions": {
        "baseUrl": ".",
        "rootDir": ".",
        "sourceMap": true,
        "declaration": false,
        "moduleResolution": "bundler",
        "experimentalDecorators": true,
        "importHelpers": true,
        "target": "ES2022",
        "module": "ES2022",
        "lib": ["ES2022", "dom"],
        "skipLibCheck": true,
        "skipDefaultLibCheck": true,
        "paths": {
          "@restaurant/feature-shell": ["libs/feature-shell/src/index.ts"],
          "@restaurant/feature-auth": ["libs/feature-auth/src/index.ts"],
          "@restaurant/feature-cocina": ["libs/feature-cocina/src/index.ts"],
          "@restaurant/feature-bar": ["libs/feature-bar/src/index.ts"],
          "@restaurant/feature-restaurante": ["libs/feature-restaurante/src/index.ts"],
          "@restaurant/feature-inventario": ["libs/feature-inventario/src/index.ts"],
          "@restaurant/feature-usuarios": ["libs/feature-usuarios/src/index.ts"],
          "@restaurant/feature-reportes": ["libs/feature-reportes/src/index.ts"],
          "@restaurant/feature-facturacion": ["libs/feature-facturacion/src/index.ts"],
          "@restaurant/feature-abastecimiento": ["libs/feature-abastecimiento/src/index.ts"],
          "@restaurant/feature-presupuesto": ["libs/feature-presupuesto/src/index.ts"],
          "@restaurant/feature-requisiciones": ["libs/feature-requisiciones/src/index.ts"],
          "@restaurant/feature-notificaciones": ["libs/feature-notificaciones/src/index.ts"],
          "@restaurant/shared/auth": ["libs/shared/auth/src/index.ts"],
          "@restaurant/shared/api": ["libs/shared/api/src/index.ts"],
          "@restaurant/shared/state": ["libs/shared/state/src/index.ts"],
          "@restaurant/shared/ui": ["libs/shared/ui/src/index.ts"],
          "@restaurant/shared/models": ["libs/shared/models/src/index.ts"],
          "@restaurant/shared/util": ["libs/shared/util/src/index.ts"]
        }
      },
      "exclude": ["node_modules", "tmp"]
    }
    """,
)

add(
    "tsconfig.json",
    r"""
    {
      "extends": "./tsconfig.base.json",
      "files": [],
      "references": []
    }
    """,
)

add(
    ".eslintrc.json",
    r"""
    {
      "root": true,
      "ignorePatterns": ["**/*"],
      "plugins": ["@nx"],
      "overrides": [
        {
          "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
          "rules": {
            "@nx/enforce-module-boundaries": [
              "error",
              {
                "enforceBuildableLibDependency": true,
                "depConstraints": [
                  { "sourceTag": "scope:cocina", "onlyDependOnLibsWithTags": ["scope:shared", "scope:cocina"] },
                  { "sourceTag": "scope:bar", "onlyDependOnLibsWithTags": ["scope:shared", "scope:bar"] },
                  { "sourceTag": "scope:restaurante", "onlyDependOnLibsWithTags": ["scope:shared", "scope:restaurante"] },
                  { "sourceTag": "scope:inventario", "onlyDependOnLibsWithTags": ["scope:shared", "scope:inventario"] },
                  { "sourceTag": "scope:facturacion", "onlyDependOnLibsWithTags": ["scope:shared", "scope:facturacion"] },
                  { "sourceTag": "scope:abastecimiento", "onlyDependOnLibsWithTags": ["scope:shared", "scope:abastecimiento"] },
                  { "sourceTag": "scope:presupuesto", "onlyDependOnLibsWithTags": ["scope:shared", "scope:presupuesto"] },
                  { "sourceTag": "scope:requisiciones", "onlyDependOnLibsWithTags": ["scope:shared", "scope:requisiciones"] },
                  { "sourceTag": "scope:usuarios", "onlyDependOnLibsWithTags": ["scope:shared", "scope:usuarios"] },
                  { "sourceTag": "scope:reportes", "onlyDependOnLibsWithTags": ["scope:shared", "scope:reportes"] },
                  { "sourceTag": "scope:auth", "onlyDependOnLibsWithTags": ["scope:shared", "scope:auth"] },
                  { "sourceTag": "scope:notificaciones", "onlyDependOnLibsWithTags": ["scope:shared", "scope:notificaciones"] },
                  { "sourceTag": "scope:shell", "onlyDependOnLibsWithTags": ["scope:shared", "scope:*", "scope:shell"] },
                  { "sourceTag": "scope:shared", "onlyDependOnLibsWithTags": ["scope:shared"] },
                  { "sourceTag": "type:ui", "onlyDependOnLibsWithTags": ["type:ui", "type:util", "type:models"] },
                  { "sourceTag": "type:data-access", "onlyDependOnLibsWithTags": ["type:data-access", "type:util", "type:models"] },
                  { "sourceTag": "type:util", "onlyDependOnLibsWithTags": ["type:util", "type:models"] },
                  { "sourceTag": "type:models", "onlyDependOnLibsWithTags": ["type:models"] },
                  { "sourceTag": "type:feature", "onlyDependOnLibsWithTags": ["type:feature", "type:ui", "type:util", "type:models", "type:data-access"] }
                ]
              }
            ]
          }
        }
      ]
    }
    """,
)

add(
    ".prettierrc.json",
    r"""
    {
      "printWidth": 100,
      "singleQuote": true,
      "overrides": [
        {
          "files": "*.html",
          "options": {
            "parser": "angular"
          }
        }
      ]
    }
    """,
)

add(
    ".gitignore",
    r"""
    node_modules/
    dist/
    .tmp/
    coverage/
    .angular/
    .nx/
    .env
    """,
)

add(
    "CONTRIBUTING.md",
    r"""
    # CONTRIBUTING

    ## Reglas de arquitectura

    1. No importar de otro `feature-*` directamente.
    2. No importar de `feature-*` dentro de `shared/`.
    3. No redefinir interfaces que existen en `shared/models/`.
    4. No definir colores, espaciados ni tipografía fuera de `libs/shared/ui/src/lib/tokens/_variables.scss`.

    ## Reglas de Git

    1. Formato de rama: `{tipo}/{scope}/{descripcion}`.
    2. Un scope por PR.
    3. Máximo 400 líneas por PR.
    4. Validar `nx affected:lint --base=develop` y `nx affected:test --base=develop` antes del PR.
    5. No self-merge.
    6. Conventional Commits obligatorio.

    ## Reglas de calidad

    1. Todo componente nuevo lleva su `.spec.ts`.
    2. Todo servicio nuevo lleva su `.spec.ts`.
    3. Coverage mínimo 70% por librería.
    4. No `any` en TypeScript.
    5. No estilos inline en templates.
    """,
)

add(
    "apps/restaurant-app/project.json",
    r"""
    {
      "name": "restaurant-app",
      "$schema": "../../node_modules/nx/schemas/project-schema.json",
      "projectType": "application",
      "sourceRoot": "apps/restaurant-app/src",
      "tags": ["scope:app", "type:feature"],
      "targets": {
        "build": {
          "executor": "@angular/build:application",
          "options": {
            "outputPath": "dist/apps/restaurant-app",
            "index": "apps/restaurant-app/src/index.html",
            "browser": "apps/restaurant-app/src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "apps/restaurant-app/tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [],
            "styles": ["apps/restaurant-app/src/styles.scss"]
          },
          "configurations": {
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            },
            "production": {
              "outputHashing": "all"
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "executor": "@angular/build:dev-server",
          "options": {
            "buildTarget": "restaurant-app:build:development"
          }
        }
      }
    }
    """,
)

add(
    "apps/restaurant-app/tsconfig.app.json",
    r"""
    {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": {
        "outDir": "../../dist/out-tsc"
      },
      "files": ["src/main.ts"],
      "include": ["src/**/*.ts"]
    }
    """,
)

add(
    "apps/restaurant-app/src/index.html",
    r"""
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Restaurant Monorepo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <app-root></app-root>
      </body>
    </html>
    """,
)

add(
    "apps/restaurant-app/src/styles.scss",
    r"""
    @use '../../../libs/shared/ui/src/lib/tokens/index.scss';
    """,
)

add(
    "apps/restaurant-app/src/main.ts",
    r"""
    import { bootstrapApplication } from '@angular/platform-browser';
    import { AppComponent } from './app/app.component';
    import { appConfig } from './app/app.config';

    bootstrapApplication(AppComponent, appConfig).catch(error => console.error(error));
    """,
)

add(
    "apps/restaurant-app/src/app/app.component.ts",
    r"""
    import { ChangeDetectionStrategy, Component } from '@angular/core';
    import { RouterOutlet } from '@angular/router';

    @Component({
      selector: 'app-root',
      standalone: true,
      imports: [RouterOutlet],
      templateUrl: './app.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    export class AppComponent {}
    """,
)

add(
    "apps/restaurant-app/src/app/app.component.html",
    r"""
    <router-outlet></router-outlet>
    """,
)

add(
    "apps/restaurant-app/src/app/app.config.ts",
    r"""
    import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
    import { provideHttpClient, withInterceptors } from '@angular/common/http';
    import { provideRouter } from '@angular/router';
    import { provideStore } from '@ngrx/store';
    import { errorInterceptor, jwtInterceptor, loadingInterceptor } from '@restaurant/shared/api';
    import { shellRoutes } from '@restaurant/feature-shell';

    export const appConfig: ApplicationConfig = {
      providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(shellRoutes),
        provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor, loadingInterceptor])),
        provideStore(),
      ],
    };
    """,
)

add(
    "libs/feature-shell/project.json",
    r"""
    {
      "name": "feature-shell",
      "$schema": "../../node_modules/nx/schemas/project-schema.json",
      "projectType": "library",
      "sourceRoot": "libs/feature-shell/src",
      "tags": ["scope:shell", "type:feature"]
    }
    """,
)

add(
    "libs/feature-shell/src/index.ts",
    r"""
    export * from './lib/shell.routes';
    export * from './lib/nav/nav-config';
    """,
)

add(
    "libs/feature-shell/src/lib/shell.routes.ts",
    r"""
    import { Routes } from '@angular/router';
    import { Rol } from '@restaurant/shared/models';
    import { authGuard } from './guards/auth.guard';
    import { roleGuard } from './guards/role.guard';
    import { ShellLayoutComponent } from './shell-layout/shell-layout.component';

    export const shellRoutes: Routes = [
      {
        path: '',
        component: ShellLayoutComponent,
        canActivate: [authGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'inventario',
          },
          {
            path: 'cocina',
            canActivate: [roleGuard([Rol.CHEF, Rol.ADMIN_COCINA, Rol.AUXILIAR_COCINA])],
            loadChildren: () => import('@restaurant/feature-cocina').then(m => m.COCINA_ROUTES),
          },
          {
            path: 'bar',
            canActivate: [roleGuard([Rol.LIDER_BAR, Rol.ADMIN_BAR, Rol.BARTENDER])],
            loadChildren: () => import('@restaurant/feature-bar').then(m => m.BAR_ROUTES),
          },
          {
            path: 'restaurante',
            loadChildren: () =>
              import('@restaurant/feature-restaurante').then(m => m.RESTAURANTE_ROUTES),
          },
          {
            path: 'inventario',
            canActivate: [roleGuard([Rol.ADMINISTRADOR, Rol.CONTADORA])],
            loadChildren: () =>
              import('@restaurant/feature-inventario').then(m => m.INVENTARIO_ROUTES),
          },
          {
            path: 'usuarios',
            loadChildren: () => import('@restaurant/feature-usuarios').then(m => m.USUARIOS_ROUTES),
          },
          {
            path: 'reportes',
            loadChildren: () => import('@restaurant/feature-reportes').then(m => m.REPORTES_ROUTES),
          },
          {
            path: 'facturacion',
            loadChildren: () =>
              import('@restaurant/feature-facturacion').then(m => m.FACTURACION_ROUTES),
          },
          {
            path: 'abastecimiento',
            loadChildren: () =>
              import('@restaurant/feature-abastecimiento').then(
                m => m.ABASTECIMIENTO_ROUTES,
              ),
          },
          {
            path: 'presupuesto',
            loadChildren: () =>
              import('@restaurant/feature-presupuesto').then(m => m.PRESUPUESTO_ROUTES),
          },
          {
            path: 'requisiciones',
            loadChildren: () =>
              import('@restaurant/feature-requisiciones').then(m => m.REQUISICIONES_ROUTES),
          },
          {
            path: 'notificaciones',
            loadChildren: () =>
              import('@restaurant/feature-notificaciones').then(m => m.NOTIFICACIONES_ROUTES),
          },
        ],
      },
      {
        path: 'auth',
        loadChildren: () => import('@restaurant/feature-auth').then(m => m.AUTH_ROUTES),
      },
    ];
    """,
)

add(
    "libs/feature-shell/src/lib/guards/auth.guard.ts",
    r"""
    import { inject } from '@angular/core';
    import { CanActivateFn, Router } from '@angular/router';
    import { AuthService } from '@restaurant/shared/auth';

    export const authGuard: CanActivateFn = () => {
      const authService = inject(AuthService);
      const router = inject(Router);

      if (authService.isAuthenticated()) {
        return true;
      }

      return router.createUrlTree(['/auth/login']);
    };
    """,
)

add(
    "libs/feature-shell/src/lib/guards/role.guard.ts",
    r"""
    import { inject } from '@angular/core';
    import { CanActivateFn, Router } from '@angular/router';
    import { AuthService } from '@restaurant/shared/auth';
    import { Rol } from '@restaurant/shared/models';

    export const roleGuard = (allowedRoles: Rol[]): CanActivateFn => () => {
      const authService = inject(AuthService);
      const router = inject(Router);
      const currentUser = authService.currentUser();

      if (currentUser && allowedRoles.includes(currentUser.rol)) {
        return true;
      }

      return router.createUrlTree(['/']);
    };
    """,
)

add(
    "libs/feature-shell/src/lib/nav/nav-config.ts",
    r"""
    import { Rol } from '@restaurant/shared/models';

    export interface ShellNavItem {
      label: string;
      route: string;
      icon: string;
      roles?: Rol[];
    }

    export interface ShellNavGroup {
      label: string;
      items: ShellNavItem[];
    }

    export const SHELL_NAV_CONFIG: ShellNavGroup[] = [
      {
        label: 'Operación',
        items: [
          {
            label: 'Cocina',
            route: '/cocina',
            icon: 'restaurant',
            roles: [Rol.CHEF, Rol.ADMIN_COCINA, Rol.AUXILIAR_COCINA],
          },
          {
            label: 'Bar',
            route: '/bar',
            icon: 'local_bar',
            roles: [Rol.LIDER_BAR, Rol.ADMIN_BAR, Rol.BARTENDER],
          },
          { label: 'Restaurante', route: '/restaurante', icon: 'table_restaurant' },
        ],
      },
      {
        label: 'Administración',
        items: [
          { label: 'Inventario', route: '/inventario', icon: 'inventory_2' },
          { label: 'Usuarios', route: '/usuarios', icon: 'group' },
          { label: 'Facturación', route: '/facturacion', icon: 'receipt_long' },
          { label: 'Abastecimiento', route: '/abastecimiento', icon: 'package_2' },
          { label: 'Presupuesto', route: '/presupuesto', icon: 'account_balance_wallet' },
          { label: 'Requisiciones', route: '/requisiciones', icon: 'assignment' },
          { label: 'Reportes', route: '/reportes', icon: 'bar_chart' },
          { label: 'Notificaciones', route: '/notificaciones', icon: 'notifications' },
        ],
      },
    ];
    """,
)

add(
    "libs/feature-shell/src/lib/shell-layout/shell-layout.component.ts",
    r"""
    import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
    import { NgFor } from '@angular/common';
    import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
    import { AuthService } from '@restaurant/shared/auth';
    import { SHELL_NAV_CONFIG } from '../nav/nav-config';

    @Component({
      selector: 'restaurant-shell-layout',
      standalone: true,
      imports: [NgFor, RouterLink, RouterLinkActive, RouterOutlet],
      templateUrl: './shell-layout.component.html',
      styleUrl: './shell-layout.component.scss',
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    export class ShellLayoutComponent {
      private readonly authService = inject(AuthService);

      protected readonly navGroups = SHELL_NAV_CONFIG;
      protected readonly currentUser = computed(() => this.authService.currentUser());
    }
    """,
)

add(
    "libs/feature-shell/src/lib/shell-layout/shell-layout.component.html",
    r"""
    <div class="shell-layout">
      <aside class="shell-layout__sidebar">
        <div class="shell-layout__brand">
          <span class="shell-layout__brand-badge">GS</span>
          <div>
            <strong class="shell-layout__brand-title">GastroSena</strong>
            <small class="shell-layout__brand-subtitle">Monorepo Angular 20</small>
          </div>
        </div>

        <nav class="shell-layout__nav" *ngFor="let group of navGroups">
          <p class="shell-layout__nav-group">{{ group.label }}</p>
          <a
            *ngFor="let item of group.items"
            [routerLink]="item.route"
            routerLinkActive="shell-layout__nav-link--active"
            class="shell-layout__nav-link"
          >
            <span>{{ item.label }}</span>
          </a>
        </nav>
      </aside>

      <div class="shell-layout__main">
        <header class="shell-layout__topbar">
          <div>
            <strong>Plataforma formativa gastronómica</strong>
          </div>
          <div class="shell-layout__user">
            <span>{{ currentUser()?.nombre ?? 'Usuario autenticado' }}</span>
          </div>
        </header>

        <main class="shell-layout__content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
    """,
)

add(
    "libs/feature-shell/src/lib/shell-layout/shell-layout.component.scss",
    r"""
    :host {
      display: block;
    }

    .shell-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      min-height: 100vh;
      background: var(--color-surface-secondary);
    }

    .shell-layout__sidebar {
      border-right: 1px solid var(--color-border);
      background: var(--color-surface-primary);
      padding: var(--space-6);
    }

    .shell-layout__brand {
      display: flex;
      gap: var(--space-3);
      align-items: center;
      margin-bottom: var(--space-8);
    }

    .shell-layout__brand-badge {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      display: grid;
      place-items: center;
      background: var(--color-brand-primary);
      color: white;
      font-weight: 700;
    }

    .shell-layout__brand-title,
    .shell-layout__nav-group {
      display: block;
    }

    .shell-layout__brand-subtitle {
      color: var(--color-text-secondary);
    }

    .shell-layout__nav {
      margin-bottom: var(--space-6);
    }

    .shell-layout__nav-group {
      margin-bottom: var(--space-2);
      text-transform: uppercase;
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
    }

    .shell-layout__nav-link {
      display: block;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      color: var(--color-text-primary);
      text-decoration: none;
    }

    .shell-layout__nav-link:hover,
    .shell-layout__nav-link--active {
      background: var(--color-brand-primary-soft);
      color: var(--color-brand-primary-strong);
    }

    .shell-layout__main {
      display: grid;
      grid-template-rows: 64px 1fr;
    }

    .shell-layout__topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-6);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-surface-primary);
    }

    .shell-layout__content {
      padding: var(--space-6);
    }
    """,
)

add(
    "libs/shared/auth/project.json",
    r"""
    {
      "name": "shared-auth",
      "$schema": "../../../node_modules/nx/schemas/project-schema.json",
      "projectType": "library",
      "sourceRoot": "libs/shared/auth/src",
      "tags": ["scope:shared", "scope:auth", "type:data-access"]
    }
    """,
)

add(
    "libs/shared/auth/src/index.ts",
    r"""
    export * from './lib/auth.models';
    export * from './lib/current-user.signal';
    export * from './lib/auth.service';
    """,
)

add(
    "libs/shared/auth/src/lib/auth.models.ts",
    r"""
    import { Rol } from '@restaurant/shared/models';

    export interface LoginRequest {
      email: string;
      password: string;
    }

    export interface TokenPayload {
      sub: string;
      rol: Rol;
      exp: number;
    }

    export interface AuthenticatedUser {
      id: string;
      nombre: string;
      email: string;
      rol: Rol;
    }
    """,
)

add(
    "libs/shared/auth/src/lib/current-user.signal.ts",
    r"""
    import { signal } from '@angular/core';
    import { AuthenticatedUser } from './auth.models';

    export const currentUserSignal = signal<AuthenticatedUser | null>(null);
    """,
)

add(
    "libs/shared/auth/src/lib/auth.service.ts",
    r"""
    import { Injectable } from '@angular/core';
    import { currentUserSignal } from './current-user.signal';
    import { AuthenticatedUser } from './auth.models';
    import { Rol } from '@restaurant/shared/models';

    @Injectable({ providedIn: 'root' })
    export class AuthService {
      private readonly fallbackUser: AuthenticatedUser = {
        id: 'seed-admin',
        nombre: 'Administrador Base',
        email: 'admin@gastrosena.local',
        rol: Rol.ADMINISTRADOR,
      };

      constructor() {
        if (!currentUserSignal()) {
          currentUserSignal.set(this.fallbackUser);
        }
      }

      currentUser(): AuthenticatedUser | null {
        return currentUserSignal();
      }

      isAuthenticated(): boolean {
        return !!currentUserSignal();
      }

      login(): void {
        currentUserSignal.set(this.fallbackUser);
      }

      logout(): void {
        currentUserSignal.set(null);
      }
    }
    """,
)

add(
    "libs/shared/api/project.json",
    r"""
    {
      "name": "shared-api",
      "$schema": "../../../node_modules/nx/schemas/project-schema.json",
      "projectType": "library",
      "sourceRoot": "libs/shared/api/src",
      "tags": ["scope:shared", "type:data-access"]
    }
    """,
)

add(
    "libs/shared/api/src/index.ts",
    r"""
    export * from './lib/api-config.token';
    export * from './lib/base-http.service';
    export * from './lib/error.interceptor';
    export * from './lib/loading.interceptor';
    export * from './lib/jwt.interceptor';
    """,
)

add(
    "libs/shared/api/src/lib/api-config.token.ts",
    r"""
    import { InjectionToken } from '@angular/core';

    export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
      providedIn: 'root',
      factory: () => '/api',
    });
    """,
)

add(
    "libs/shared/api/src/lib/base-http.service.ts",
    r"""
    import { HttpClient } from '@angular/common/http';
    import { inject, Injectable } from '@angular/core';
    import { API_BASE_URL } from './api-config.token';

    @Injectable({ providedIn: 'root' })
    export class BaseHttpService {
      protected readonly http = inject(HttpClient);
      protected readonly apiBaseUrl = inject(API_BASE_URL);

      protected buildUrl(resource: string): string {
        return `${this.apiBaseUrl}/${resource}`;
      }
    }
    """,
)

add(
    "libs/shared/api/src/lib/error.interceptor.ts",
    r"""
    import { HttpInterceptorFn } from '@angular/common/http';
    import { catchError, throwError } from 'rxjs';

    export const errorInterceptor: HttpInterceptorFn = (req, next) =>
      next(req).pipe(
        catchError(error => {
          console.error('HTTP error captured by shared/api:', error);
          return throwError(() => error);
        }),
      );
    """,
)

add(
    "libs/shared/api/src/lib/loading.interceptor.ts",
    r"""
    import { HttpInterceptorFn } from '@angular/common/http';
    import { finalize } from 'rxjs';

    export const loadingInterceptor: HttpInterceptorFn = (req, next) =>
      next(req).pipe(finalize(() => void req.url));
    """,
)

add(
    "libs/shared/api/src/lib/jwt.interceptor.ts",
    r"""
    import { HttpInterceptorFn } from '@angular/common/http';

    export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: 'Bearer development-token',
        },
      });

      return next(clonedRequest);
    };
    """,
)

add(
    "libs/shared/state/project.json",
    r"""
    {
      "name": "shared-state",
      "$schema": "../../../node_modules/nx/schemas/project-schema.json",
      "projectType": "library",
      "sourceRoot": "libs/shared/state/src",
      "tags": ["scope:shared", "type:data-access"]
    }
    """,
)

add(
    "libs/shared/state/src/index.ts",
    r"""
    export * from './lib/app.state';
    export * from './lib/ui/ui.reducer';
    export * from './lib/ui/ui.selectors';
    export * from './lib/router/router.selectors';
    export * from './lib/metareducers/hydration.metareducer';
    """,
)

add(
    "libs/shared/state/src/lib/app.state.ts",
    r"""
    import { UiState } from './ui/ui.reducer';

    export interface AppState {
      ui: UiState;
    }
    """,
)

add(
    "libs/shared/state/src/lib/ui/ui.reducer.ts",
    r"""
    export interface UiState {
      isLoading: boolean;
      sidebarOpen: boolean;
      activeTheme: 'light' | 'dark';
    }

    export const initialUiState: UiState = {
      isLoading: false,
      sidebarOpen: true,
      activeTheme: 'light',
    };
    """,
)

add(
    "libs/shared/state/src/lib/ui/ui.selectors.ts",
    r"""
    import { AppState } from '../app.state';

    export const selectUiState = (state: AppState) => state.ui;
    export const selectIsLoading = (state: AppState) => state.ui.isLoading;
    export const selectSidebarOpen = (state: AppState) => state.ui.sidebarOpen;
    """,
)

add(
    "libs/shared/state/src/lib/router/router.selectors.ts",
    r"""
    export const selectCurrentUrl = (_state: unknown) => '';
    """,
)

add(
    "libs/shared/state/src/lib/metareducers/hydration.metareducer.ts",
    r"""
    export function hydrationMetaReducer<T>(state: T): T {
      return state;
    }
    """,
)

add(
    "libs/shared/models/project.json",
    r"""
    {
      "name": "shared-models",
      "$schema": "../../../node_modules/nx/schemas/project-schema.json",
      "projectType": "library",
      "sourceRoot": "libs/shared/models/src",
      "tags": ["scope:shared", "type:models"]
    }
    """,
)

add(
    "libs/shared/models/src/index.ts",
    r"""
    export * from './lib/usuario.model';
    export * from './lib/pedido.model';
    export * from './lib/bien.model';
    export * from './lib/factura.model';
    export * from './lib/pagination.model';
    export * from './lib/api-response.model';
    """,
)

add(
    "libs/shared/models/src/lib/usuario.model.ts",
    r"""
    export enum Rol {
      ADMINISTRADOR = 'ADMINISTRADOR',
      CONTADORA = 'CONTADORA',
      INSTRUCTOR = 'INSTRUCTOR',
      CHEF = 'CHEF',
      LIDER_BAR = 'LIDER_BAR',
      MESERO = 'MESERO',
      BARTENDER = 'BARTENDER',
      AUXILIAR_COCINA = 'AUXILIAR_COCINA',
      CAJERO = 'CAJERO',
      ADMIN_COCINA = 'ADMIN_COCINA',
      ADMIN_BAR = 'ADMIN_BAR',
    }

    export interface Usuario {
      id: string;
      nombre: string;
      email: string;
      rol: Rol;
      activo: boolean;
      creadoEn: Date;
    }
    """,
)

add(
    "libs/shared/models/src/lib/pedido.model.ts",
    r"""
    export enum EstadoPedido {
      ESPERA = 'ESPERA',
      PREPARACION = 'PREPARACION',
      LISTO = 'LISTO',
      ENTREGADO = 'ENTREGADO',
      CANCELADO = 'CANCELADO',
    }

    export interface PedidoItem {
      productoId: string;
      nombre: string;
      cantidad: number;
      precioUnit: number;
      observacion?: string;
    }

    export interface Pedido {
      id: string;
      numero: number;
      mesaId: string;
      meseroId: string;
      estado: EstadoPedido;
      destino: 'COCINA' | 'BAR';
      horaCreacion: Date;
      items: PedidoItem[];
      total: number;
    }
    """,
)

add(
    "libs/shared/models/src/lib/bien.model.ts",
    r"""
    export type EstadoStock = 'DISPONIBLE' | 'BAJO_STOCK' | 'AGOTADO';

    export interface Bien {
      id: string;
      codigo: string;
      nombre: string;
      categoria: string;
      unidadMedida: string;
      stockActual: number;
      stockMinimo: number;
      estadoStock: EstadoStock;
    }
    """,
)

add(
    "libs/shared/models/src/lib/factura.model.ts",
    r"""
    export enum EstadoFactura {
      REGISTRADA = 'REGISTRADA',
      VERIFICADA = 'VERIFICADA',
      PAGADA = 'PAGADA',
      ANULADA = 'ANULADA',
    }

    export interface Factura {
      id: string;
      cufe: string;
      proveedor: string;
      valorTotal: number;
      estado: EstadoFactura;
      fechaEmision: string;
    }
    """,
)

add(
    "libs/shared/models/src/lib/pagination.model.ts",
    r"""
    export interface PageRequest {
      page: number;
      size: number;
      sortBy?: string;
      sortDir?: 'asc' | 'desc';
    }

    export interface PaginatedResponse<T> {
      content: T[];
      totalElements: number;
      totalPages: number;
      currentPage: number;
      size: number;
    }
    """,
)

add(
    "libs/shared/models/src/lib/api-response.model.ts",
    r"""
    export interface ApiResponse<T> {
      data: T;
      message: string;
      timestamp: string;
      success: boolean;
    }
    """,
)

add(
    "libs/shared/util/project.json",
    r"""
    {
      "name": "shared-util",
      "$schema": "../../../node_modules/nx/schemas/project-schema.json",
      "projectType": "library",
      "sourceRoot": "libs/shared/util/src",
      "tags": ["scope:shared", "type:util"]
    }
    """,
)

add(
    "libs/shared/util/src/index.ts",
    r"""
    export * from './lib/pipes/currency-cop.pipe';
    export * from './lib/pipes/date-co.pipe';
    export * from './lib/pipes/estado-pedido.pipe';
    export * from './lib/validators/cufe.validator';
    export * from './lib/validators/nit.validator';
    export * from './lib/formatters/iva.calculator';
    export * from './lib/formatters/zese.calculator';
    """,
)

add(
    "libs/shared/util/src/lib/pipes/currency-cop.pipe.ts",
    r"""
    import { Pipe, PipeTransform } from '@angular/core';

    @Pipe({ name: 'currencyCop', standalone: true })
    export class CurrencyCopPipe implements PipeTransform {
      transform(value: number): string {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits: 0,
        }).format(value);
      }
    }
    """,
)

add(
    "libs/shared/util/src/lib/pipes/date-co.pipe.ts",
    r"""
    import { Pipe, PipeTransform } from '@angular/core';

    @Pipe({ name: 'dateCo', standalone: true })
    export class DateCoPipe implements PipeTransform {
      transform(value: string | Date): string {
        return new Intl.DateTimeFormat('es-CO').format(new Date(value));
      }
    }
    """,
)

add(
    "libs/shared/util/src/lib/pipes/estado-pedido.pipe.ts",
    r"""
    import { Pipe, PipeTransform } from '@angular/core';
    import { EstadoPedido } from '@restaurant/shared/models';

    @Pipe({ name: 'estadoPedido', standalone: true })
    export class EstadoPedidoPipe implements PipeTransform {
      transform(value: EstadoPedido): string {
        const labels: Record<EstadoPedido, string> = {
          [EstadoPedido.ESPERA]: 'En espera',
          [EstadoPedido.PREPARACION]: 'En preparación',
          [EstadoPedido.LISTO]: 'Listo',
          [EstadoPedido.ENTREGADO]: 'Entregado',
          [EstadoPedido.CANCELADO]: 'Cancelado',
        };

        return labels[value] ?? value;
      }
    }
    """,
)

add(
    "libs/shared/util/src/lib/validators/cufe.validator.ts",
    r"""
    export function isValidCufe(value: string): boolean {
      return /^[a-fA-F0-9]{64}$/.test(value);
    }
    """,
)

add(
    "libs/shared/util/src/lib/validators/nit.validator.ts",
    r"""
    export function isValidNit(value: string): boolean {
      return /^[0-9]{8,15}$/.test(value);
    }
    """,
)

add(
    "libs/shared/util/src/lib/formatters/iva.calculator.ts",
    r"""
    export function calculateIva(baseValue: number, rate: 0 | 5 | 19): number {
      return (baseValue * rate) / 100;
    }
    """,
)

add(
    "libs/shared/util/src/lib/formatters/zese.calculator.ts",
    r"""
    export function calculateZese(baseValue: number): number {
      return baseValue * 0.00625;
    }
    """,
)

add(
    "libs/shared/ui/project.json",
    r"""
    {
      "name": "shared-ui",
      "$schema": "../../../node_modules/nx/schemas/project-schema.json",
      "projectType": "library",
      "sourceRoot": "libs/shared/ui/src",
      "tags": ["scope:shared", "type:ui"]
    }
    """,
)

add(
    "libs/shared/ui/src/index.ts",
    r"""
    export * from './lib/components/page-header/page-header.component';
    export * from './lib/components/empty-state/empty-state.component';
    export * from './lib/components/status-badge/status-badge.component';
    """,
)

add(
    "libs/shared/ui/src/lib/components/page-header/page-header.component.ts",
    r"""
    import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
    import { NgIf } from '@angular/common';

    @Component({
      selector: 'restaurant-page-header',
      standalone: true,
      imports: [NgIf],
      template: `
        <header class="page-header">
          <div>
            <h1 class="page-header__title">{{ title }}</h1>
            <p class="page-header__subtitle" *ngIf="subtitle">{{ subtitle }}</p>
          </div>
        </header>
      `,
      styleUrl: './page-header.component.scss',
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    export class PageHeaderComponent {
      @Input({ required: true }) title!: string;
      @Input() subtitle?: string;
    }
    """,
)

add(
    "libs/shared/ui/src/lib/components/page-header/page-header.component.scss",
    r"""
    .page-header {
      margin-bottom: var(--space-6);
    }

    .page-header__title {
      font-size: var(--font-size-2xl);
      margin: 0 0 var(--space-2);
    }

    .page-header__subtitle {
      margin: 0;
      color: var(--color-text-secondary);
    }
    """,
)

add(
    "libs/shared/ui/src/lib/components/empty-state/empty-state.component.ts",
    r"""
    import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

    @Component({
      selector: 'restaurant-empty-state',
      standalone: true,
      template: `
        <section class="empty-state">
          <strong class="empty-state__title">{{ title }}</strong>
          <p class="empty-state__message">{{ message }}</p>
        </section>
      `,
      styleUrl: './empty-state.component.scss',
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    export class EmptyStateComponent {
      @Input({ required: true }) title!: string;
      @Input({ required: true }) message!: string;
    }
    """,
)

add(
    "libs/shared/ui/src/lib/components/empty-state/empty-state.component.scss",
    r"""
    .empty-state {
      border: 1px dashed var(--color-border-strong);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      background: var(--color-surface-primary);
    }

    .empty-state__title {
      display: block;
      margin-bottom: var(--space-2);
    }

    .empty-state__message {
      margin: 0;
      color: var(--color-text-secondary);
    }
    """,
)

add(
    "libs/shared/ui/src/lib/components/status-badge/status-badge.component.ts",
    r"""
    import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

    @Component({
      selector: 'restaurant-status-badge',
      standalone: true,
      template: `<span class="status-badge" [class]="'status-badge status-badge--' + variant">{{ label }}</span>`,
      styleUrl: './status-badge.component.scss',
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    export class StatusBadgeComponent {
      @Input({ required: true }) label!: string;
      @Input() variant: 'success' | 'warning' | 'danger' | 'info' = 'info';
    }
    """,
)

add(
    "libs/shared/ui/src/lib/components/status-badge/status-badge.component.scss",
    r"""
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
    }

    .status-badge--success { background: rgba(0, 184, 148, 0.12); color: var(--color-success); }
    .status-badge--warning { background: rgba(253, 203, 110, 0.2); color: #8a5b00; }
    .status-badge--danger { background: rgba(214, 48, 49, 0.12); color: var(--color-danger); }
    .status-badge--info { background: rgba(9, 132, 227, 0.12); color: var(--color-info); }
    """,
)

add(
    "libs/shared/ui/src/lib/tokens/_variables.scss",
    r"""
    :root {
      --color-brand-primary: #39a900;
      --color-brand-primary-strong: #2f7f00;
      --color-brand-primary-soft: #e9f8dd;
      --color-success: #00b894;
      --color-warning: #fdcb6e;
      --color-danger: #d63031;
      --color-info: #0984e3;

      --color-surface-primary: #ffffff;
      --color-surface-secondary: #f8f9fa;
      --color-surface-tertiary: #f1f3f5;
      --color-border: #dee2e6;
      --color-border-strong: #adb5bd;

      --color-text-primary: #2d3436;
      --color-text-secondary: #636e72;
      --color-text-disabled: #b2bec3;

      --space-1: 4px;
      --space-2: 8px;
      --space-3: 12px;
      --space-4: 16px;
      --space-5: 20px;
      --space-6: 24px;
      --space-8: 32px;
      --space-10: 40px;
      --space-12: 48px;
      --space-16: 64px;

      --font-family-base: 'Inter', 'Segoe UI', system-ui, sans-serif;
      --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
      --font-size-xs: 11px;
      --font-size-sm: 13px;
      --font-size-md: 15px;
      --font-size-lg: 18px;
      --font-size-xl: 22px;
      --font-size-2xl: 28px;
      --font-weight-regular: 400;
      --font-weight-medium: 500;
      --font-weight-semibold: 600;

      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 12px;
      --radius-xl: 16px;
      --radius-pill: 999px;

      --shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.06);
      --shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.08);
      --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    """,
)

add(
    "libs/shared/ui/src/lib/tokens/index.scss",
    r"""
    @use './variables';

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      min-height: 100%;
      font-family: var(--font-family-base);
      background: var(--color-surface-secondary);
      color: var(--color-text-primary);
    }

    a {
      color: inherit;
      text-decoration: none;
    }
    """,
)

add(
    "libs/feature-auth/project.json",
    r"""
    {
      "name": "feature-auth",
      "$schema": "../../node_modules/nx/schemas/project-schema.json",
      "projectType": "library",
      "sourceRoot": "libs/feature-auth/src",
      "tags": ["scope:auth", "type:feature"]
    }
    """,
)

add(
    "libs/feature-auth/src/index.ts",
    r"""
    export * from './lib/auth.routes';
    """,
)

add(
    "libs/feature-auth/src/lib/auth.routes.ts",
    r"""
    import { Routes } from '@angular/router';
    import { LoginPageComponent } from './ui/login-page.component';

    export const AUTH_ROUTES: Routes = [
      {
        path: 'login',
        component: LoginPageComponent,
      },
    ];
    """,
)

add(
    "libs/feature-auth/src/lib/ui/login-page.component.ts",
    r"""
    import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
    import { Router } from '@angular/router';
    import { AuthService } from '@restaurant/shared/auth';

    @Component({
      selector: 'restaurant-login-page',
      standalone: true,
      template: `
        <section class="login-page">
          <h1>Acceso al sistema</h1>
          <p>Base inicial de autenticación para el monorepo Angular 20.</p>
          <button type="button" (click)="login()">Ingresar como administrador base</button>
        </section>
      `,
      styles: [
        `
          .login-page {
            min-height: 100vh;
            display: grid;
            place-content: center;
            gap: 16px;
            padding: 24px;
          }

          button {
            border: 0;
            border-radius: 8px;
            padding: 12px 16px;
            background: #39a900;
            color: white;
            font-weight: 600;
          }
        `,
      ],
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    export class LoginPageComponent {
      private readonly authService = inject(AuthService);
      private readonly router = inject(Router);

      login(): void {
        this.authService.login();
        void this.router.navigateByUrl('/');
      }
    }
    """,
)

feature_specs = [
    ("feature-cocina", "scope:cocina", "COCINA_ROUTES", "Cocina", "Pedidos, recetas, tiempos y menús."),
    ("feature-bar", "scope:bar", "BAR_ROUTES", "Bar y Barismo", "Pedidos de bebidas, recetas y alertas."),
    ("feature-restaurante", "scope:restaurante", "RESTAURANTE_ROUTES", "Restaurante", "Mesas, salón, comandas y atención."),
    ("feature-inventario", "scope:inventario", "INVENTARIO_ROUTES", "Inventario", "Bienes, movimientos, stock y conciliación."),
    ("feature-usuarios", "scope:usuarios", "USUARIOS_ROUTES", "Usuarios", "Gestión de usuarios, roles y permisos."),
    ("feature-reportes", "scope:reportes", "REPORTES_ROUTES", "Reportes", "Reportes PDF y Excel por dominio."),
    ("feature-facturacion", "scope:facturacion", "FACTURACION_ROUTES", "Facturación", "FEL, CUFE y ciclo de vida de facturas."),
    ("feature-abastecimiento", "scope:abastecimiento", "ABASTECIMIENTO_ROUTES", "Abastecimiento", "GIL-F-014, consolidados y paquete probatorio."),
    ("feature-presupuesto", "scope:presupuesto", "PRESUPUESTO_ROUTES", "Presupuesto", "Techos, ejecución y ZESE."),
    ("feature-requisiciones", "scope:requisiciones", "REQUISICIONES_ROUTES", "Requisiciones", "Requisiciones diarias y actas."),
    ("feature-notificaciones", "scope:notificaciones", "NOTIFICACIONES_ROUTES", "Notificaciones", "Panel, historial y alertas en tiempo real."),
]

for lib_name, scope_tag, route_const, title, description in feature_specs:
    simple = lib_name.replace("feature-", "")
    class_name = "".join(part.capitalize() for part in simple.split("-")) + "PageComponent"
    facade_name = "".join(part.capitalize() for part in simple.split("-")) + "Facade"
    model_name = "".join(part.capitalize() for part in simple.split("-")) + "Context"

    add(
        f"libs/{lib_name}/project.json",
        f"""
        {{
          "name": "{lib_name}",
          "$schema": "../../node_modules/nx/schemas/project-schema.json",
          "projectType": "library",
          "sourceRoot": "libs/{lib_name}/src",
          "tags": ["{scope_tag}", "type:feature"]
        }}
        """,
    )

    add(
        f"libs/{lib_name}/src/index.ts",
        f"""
        export * from './lib/{simple}.routes';
        export * from './lib/data-access/{simple}.facade';
        export * from './lib/models/{simple}.model';
        """,
    )

    add(
        f"libs/{lib_name}/src/lib/{simple}.routes.ts",
        f"""
        import {{ Routes }} from '@angular/router';
        import {{ {class_name} }} from './ui/{simple}-page.component';

        export const {route_const}: Routes = [
          {{
            path: '',
            component: {class_name},
          }},
        ];
        """,
    )

    add(
        f"libs/{lib_name}/src/lib/ui/{simple}-page.component.ts",
        f"""
        import {{ ChangeDetectionStrategy, Component }} from '@angular/core';
        import {{ EmptyStateComponent, PageHeaderComponent }} from '@restaurant/shared/ui';

        @Component({{
          selector: 'restaurant-{simple}-page',
          standalone: true,
          imports: [PageHeaderComponent, EmptyStateComponent],
          template: `
            <restaurant-page-header
              title="{title}"
              subtitle="{description}"
            ></restaurant-page-header>

            <restaurant-empty-state
              title="Base del dominio creada"
              message="Esta librería ya existe con la estructura oficial del monorepo. El siguiente paso es migrar la implementación legacy respetando los boundaries."
            ></restaurant-empty-state>
          `,
          changeDetection: ChangeDetectionStrategy.OnPush,
        }})
        export class {class_name} {{}}
        """,
    )

    add(
        f"libs/{lib_name}/src/lib/data-access/{simple}.facade.ts",
        f"""
        import {{ Injectable }} from '@angular/core';

        @Injectable({{ providedIn: 'root' }})
        export class {facade_name} {{}}
        """,
    )

    add(
        f"libs/{lib_name}/src/lib/models/{simple}.model.ts",
        f"""
        export interface {model_name} {{
          title: string;
          description: string;
        }}
        """,
    )

    add(
        f"libs/{lib_name}/src/lib/util/index.ts",
        f"""
        export const {simple.replace('-', '_')}_util_placeholder = true;
        """,
    )


def main() -> None:
    for relative_path, content in files.items():
        target = ROOT / relative_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")

    print(f"Created/updated {len(files)} files.")


if __name__ == "__main__":
    main()
