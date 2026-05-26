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
  AlertComponent,
  EmptyStateComponent,
  KpiCardComponent,
  LoadingSkeletonComponent,
  LucideIconComponent,
  PageHeaderComponent,
  SearchFilterComponent,
} from '@restaurant/shared/ui';
import { ROL_CLASS_MAP } from '../../util/rol-class.util';
import { UsuariosFacade } from '../../data-access/usuarios.facade';
import { RolDetalle } from '../../models/usuarios.model';

const ICONO_MAP: Record<string, string> = {
  ADMINISTRADOR:   'shield',
  CONTADORA:       'banknote',
  INSTRUCTOR:      'graduation-cap',
  CHEF:            'chef-hat',
  LIDER_BAR:       'coffee',
  MESERO:          'utensils',
  BARTENDER:       'glass-water',
  AUXILIAR_COCINA: 'package',
  CAJERO:          'calculator',
  ADMIN_COCINA:    'chef-hat',
  ADMIN_BAR:       'coffee',
};

@Component({
  selector: 'restaurant-roles-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    EmptyStateComponent,
    KpiCardComponent,
    LoadingSkeletonComponent,
    LucideIconComponent,
    PageHeaderComponent,
    SearchFilterComponent,
  ],
  templateUrl: './roles-page.component.html',
  styleUrl:    './roles-page.component.scss',
})
export class RolesPageComponent implements OnInit {
  private readonly facade = inject(UsuariosFacade);

  readonly roles   = toSignal(this.facade.rolesDetalle$,        { initialValue: [] as RolDetalle[] });
  readonly loading = toSignal(this.facade.loadingRolesDetalle$, { initialValue: false });
  readonly error   = toSignal(this.facade.error$,               { initialValue: null });

  readonly busqueda = signal('');

  readonly rolesFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase();
    if (!q) return this.roles();
    return this.roles().filter(r =>
      r.nombre.toLowerCase().includes(q) || r.descripcion.toLowerCase().includes(q)
    );
  });

  readonly totalRoles    = computed(() => this.roles().length);
  readonly totalPermisos = computed(() =>
    this.roles().reduce((sum, r) => sum + r.permisos.length, 0)
  );

  ngOnInit(): void {
    this.facade.cargarRolesDetalle();
  }

  getRolClass(nombre: string): string {
    return ROL_CLASS_MAP[nombre as Rol] ?? 'default';
  }

  getIcono(nombre: string): string {
    return ICONO_MAP[nombre] ?? 'shield';
  }
}
