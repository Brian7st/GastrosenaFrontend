import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { AsignacionMasivaRequest, UsuarioDetalle } from '../../models/usuarios.model';
import { getRolClass } from '../../util/rol-class.util';

interface RolSimulacionInfo {
  readonly rol:         Rol;
  readonly icono:       string;
  readonly etiqueta:    string;
  readonly descripcion: string;
  readonly permisos:    readonly string[];
}

const ROLES_SIMULACION_INFO: readonly RolSimulacionInfo[] = [
  {
    rol: Rol.MESERO, icono: 'utensils', etiqueta: 'Mesero',
    descripcion: 'Atención al cliente y toma de pedidos',
    permisos: ['Ver mesas', 'Tomar pedidos', 'Ver comandas'],
  },
  {
    rol: Rol.BARTENDER, icono: 'coffee', etiqueta: 'Bartender',
    descripcion: 'Preparación de bebidas',
    permisos: ['Ver comandas bar', 'Recetas bebidas'],
  },
  {
    rol: Rol.CHEF, icono: 'chef-hat', etiqueta: 'Chef',
    descripcion: 'Operaciones de cocina',
    permisos: ['Ver comandas', 'Gestionar recetas', 'Ver menú'],
  },
  {
    rol: Rol.AUXILIAR_COCINA, icono: 'package', etiqueta: 'Auxiliar Cocina',
    descripcion: 'Apoyo en operaciones de cocina',
    permisos: ['Ver comandas', 'Ver ingredientes'],
  },
  {
    rol: Rol.CAJERO, icono: 'receipt', etiqueta: 'Cajero',
    descripcion: 'Gestión de caja y pagos',
    permisos: ['Gestionar caja', 'Ver facturas'],
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

  getRolClass(rol: string): string {
    return getRolClass(rol as Rol);
  }
}
