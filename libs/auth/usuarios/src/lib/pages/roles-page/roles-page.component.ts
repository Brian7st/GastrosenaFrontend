import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { Rol } from '@restaurant/shared/models';
import {
  DataTableComponent,
  EmptyStateComponent,
  KpiCardComponent,
  LoadingSkeletonComponent,
  LucideIconComponent,
  PageHeaderComponent,
} from '@restaurant/shared/ui';
import { UsuarioAvatarComponent } from '../../components/usuario-avatar/usuario-avatar.component';
import { UsuarioRolBadgeComponent } from '../../components/usuario-rol-badge/usuario-rol-badge.component';
import { UsuariosFacade } from '../../data-access/usuarios.facade';
import { I18nService } from '../../i18n/i18n.service';
import { AsignacionMasivaRequest, UsuarioDetalle } from '../../models/usuarios.model';
import { getRolClass } from '../../util/rol-class.util';

interface RolSimulacionInfo {
  readonly rol:         Rol;
  readonly icono:       string;
  readonly etiqueta:    string;
  readonly descripcion: string;
  readonly permisos:    readonly string[];
}

const ROLES_SIMULACION_INFO: readonly (RolSimulacionInfo & {
  etiquetaTKey: string; descripcionTKey: string; permisosTKeys: string[];
})[] = [
  {
    rol: Rol.MESERO, icono: 'utensils', etiqueta: 'Mesero',
    etiquetaTKey: 'roles.rol_mesero',
    descripcion: 'Atención al cliente y toma de pedidos',
    descripcionTKey: 'roles.desc_mesero',
    permisos: ['Ver mesas', 'Tomar pedidos', 'Ver comandas'],
    permisosTKeys: ['roles.perm_mesero_1', 'roles.perm_mesero_2', 'roles.perm_mesero_3'],
  },
  {
    rol: Rol.BARTENDER, icono: 'coffee', etiqueta: 'Bartender',
    etiquetaTKey: 'roles.rol_bartender',
    descripcion: 'Preparación de bebidas',
    descripcionTKey: 'roles.desc_bartender',
    permisos: ['Ver comandas bar', 'Recetas bebidas'],
    permisosTKeys: ['roles.perm_bartender_1', 'roles.perm_bartender_2'],
  },
  {
    rol: Rol.CHEF, icono: 'chef-hat', etiqueta: 'Chef',
    etiquetaTKey: 'roles.rol_chef',
    descripcion: 'Operaciones de cocina',
    descripcionTKey: 'roles.desc_chef',
    permisos: ['Ver comandas', 'Gestionar recetas', 'Ver menú'],
    permisosTKeys: ['roles.perm_chef_1', 'roles.perm_chef_2', 'roles.perm_chef_3'],
  },
  {
    rol: Rol.AUXILIAR_COCINA, icono: 'package', etiqueta: 'Auxiliar Cocina',
    etiquetaTKey: 'roles.rol_auxiliar',
    descripcion: 'Apoyo en operaciones de cocina',
    descripcionTKey: 'roles.desc_auxiliar',
    permisos: ['Ver comandas', 'Ver ingredientes'],
    permisosTKeys: ['roles.perm_auxiliar_1', 'roles.perm_auxiliar_2'],
  },
  {
    rol: Rol.CAJERO, icono: 'receipt', etiqueta: 'Cajero',
    etiquetaTKey: 'roles.rol_cajero',
    descripcion: 'Gestión de caja y pagos',
    descripcionTKey: 'roles.desc_cajero',
    permisos: ['Gestionar caja', 'Ver facturas'],
    permisosTKeys: ['roles.perm_cajero_1', 'roles.perm_cajero_2'],
  },
];

const ROLES_SIMULACION_SET = new Set<string>(ROLES_SIMULACION_INFO.map(r => r.rol));

const ROLES_STAFF = new Set<string>([
  Rol.ADMINISTRADOR, Rol.CONTADORA, Rol.INSTRUCTOR,
  
]);

@Component({
  selector: 'restaurant-roles-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    DataTableComponent,
    EmptyStateComponent,
    KpiCardComponent,
    LoadingSkeletonComponent,
    LucideIconComponent,
    PageHeaderComponent,
    UsuarioAvatarComponent,
    UsuarioRolBadgeComponent,
  ],
  templateUrl: './roles-page.component.html',
  styleUrl:    './roles-page.component.scss',
})
export class RolesPageComponent implements OnInit {
  protected readonly i18n = inject(I18nService);
  private readonly facade = inject(UsuariosFacade);

  readonly usuarios          = toSignal(this.facade.usuarios$,          { initialValue: [] as UsuarioDetalle[] });
  readonly loading           = toSignal(this.facade.loading$,           { initialValue: false });
  readonly loadingAsignacion = toSignal(this.facade.loadingAsignacion$, { initialValue: false });

  readonly rolesInfo = ROLES_SIMULACION_INFO;

  readonly aprendices = computed(() =>
    this.usuarios().filter(u => !ROLES_STAFF.has(u.rol as string)),
  );

  readonly totalAprendices = computed(() => this.aprendices().length);
  readonly totalConRol     = computed(() =>
    this.aprendices().filter(u => ROLES_SIMULACION_SET.has(u.rol as string)).length,
  );

  readonly conteoPorRol = computed(() => {
    const mapa = new Map<string, number>();
    for (const u of this.aprendices()) {
      mapa.set(u.rol as string, (mapa.get(u.rol as string) ?? 0) + 1);
    }
    return mapa;
  });

  readonly seleccionados  = signal<Set<string>>(new Set());
  readonly rolAsignacion  = signal('');
  readonly usuarioDetalle = signal<UsuarioDetalle | null>(null);

  readonly todosSeleccionados = computed(() => {
    const lista = this.aprendices();
    return lista.length > 0 && lista.every(u => this.seleccionados().has(u.id));
  });

  readonly puedeAsignar = computed(() =>
    this.seleccionados().size > 0 && this.rolAsignacion() !== '',
  );

  ngOnInit(): void {
    this.facade.cargarUsuarios();
  }

  onToggleSeleccion(id: string): void {
    this.seleccionados.update(set => {
      const next = new Set(set);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  onToggleTodos(): void {
    if (this.todosSeleccionados()) {
      this.seleccionados.set(new Set());
    } else {
      this.seleccionados.set(new Set(this.aprendices().map(u => u.id)));
    }
  }

  onRolChange(event: Event): void {
    this.rolAsignacion.set((event.target as HTMLSelectElement).value);
  }

  onAsignarRol(): void {
    const request: AsignacionMasivaRequest = {
      usuarioIds: [...this.seleccionados()],
      idRol:      this.rolAsignacion(),
    };
    this.facade.asignarRolMasivo(request);
    this.seleccionados.set(new Set());
    
  }

  estaSeleccionado(id: string): boolean {
    return this.seleccionados().has(id);
  }

  onVerDetalle(u: UsuarioDetalle): void {
    this.usuarioDetalle.set(u);
  }

  onCerrarDetalle(): void {
    this.usuarioDetalle.set(null);
  }

  getRolClass(rol: string): string {
    return getRolClass(rol as Rol);
  }
}
