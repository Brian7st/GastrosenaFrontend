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
  // Solo se gestiona el rol Auxiliar de Cocina en esta vista
  {
    rol: Rol.AUXILIAR_COCINA, icono: 'chef-hat', etiqueta: 'Auxiliar de Cocina',
    etiquetaTKey: 'roles.rol_auxiliar',
    descripcion: 'Apoyo en operaciones de cocina',
    descripcionTKey: 'roles.desc_auxiliar',
    permisos: ['Ver comandas', 'Ver ingredientes'],
    permisosTKeys: ['roles.perm_auxiliar_1', 'roles.perm_auxiliar_2'],
  },
];

const ROLES_SIMULACION_SET = new Set<string>(ROLES_SIMULACION_INFO.map(r => r.rol));

// Todos los roles que NO son Auxiliar de Cocina se tratan como Staff (excluidos de la lista de aprendices)
const ROLES_STAFF = new Set<string>([
  Rol.ADMINISTRADOR, Rol.CONTADORA, Rol.INSTRUCTOR,
  Rol.CHEF, Rol.MESERO, Rol.BARTENDER, Rol.CAJERO,
]);

// Solo se muestran en la tabla los usuarios con rol AUXILIAR_COCINA
const ROLES_APRENDIZ = new Set<string>([Rol.AUXILIAR_COCINA]);

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
  protected readonly i18n = inject(I18nService);
  private readonly facade = inject(UsuariosFacade);

  readonly usuarios          = toSignal(this.facade.usuarios$,          { initialValue: [] as UsuarioDetalle[] });
  readonly loading           = toSignal(this.facade.loading$,           { initialValue: false });
  readonly loadingAsignacion = toSignal(this.facade.loadingAsignacion$, { initialValue: false });

  readonly rolesInfo = ROLES_SIMULACION_INFO;

  // Solo muestra usuarios con rol AUXILIAR_COCINA (activos e inactivos)
  readonly aprendices = computed(() =>
    this.usuarios().filter(u => ROLES_APRENDIZ.has(u.rol as string)),
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
    // Cargar usuarios filtrando por rol AUXILIAR_COCINA desde el backend
    this.facade.cargarUsuarios({ rol: 'AUXILIAR_COCINA', tamano: 500 } as any);
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
