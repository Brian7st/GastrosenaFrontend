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
import {
  AlertComponent,
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
import { UsuarioDetalle } from '../../models/usuarios.model';

type FiltroEstado = 'todos' | 'bloqueados' | 'activos';

@Component({
  selector: 'restaurant-cuentas-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    AlertComponent,
    DataTableComponent,
    EmptyStateComponent,
    KpiCardComponent,
    LoadingSkeletonComponent,
    LucideIconComponent,
    PageHeaderComponent,
    UsuarioAvatarComponent,
    UsuarioRolBadgeComponent,
  ],
  templateUrl: './cuentas-page.component.html',
  styleUrl:    './cuentas-page.component.scss',
})
export class CuentasPageComponent implements OnInit {
  private readonly facade = inject(UsuariosFacade);

  readonly usuarios = toSignal(this.facade.usuarios$, { initialValue: [] as UsuarioDetalle[] });
  readonly loading  = toSignal(this.facade.loading$,  { initialValue: false });
  readonly error    = toSignal(this.facade.error$,    { initialValue: null });

  readonly filtroEstado = signal<FiltroEstado>('todos');

  readonly usuariosFiltrados = computed(() => {
    const estado = this.filtroEstado();
    const todos  = this.usuarios();
    if (estado === 'bloqueados') return todos.filter(u => u.cuentaBloqueada);
    if (estado === 'activos')    return todos.filter(u => !u.cuentaBloqueada);
    return todos;
  });

  readonly totalBloqueadas = computed(() =>
    this.usuarios().filter(u => u.cuentaBloqueada).length
  );

  readonly totalActivas = computed(() =>
    this.usuarios().filter(u => !u.cuentaBloqueada).length
  );

  ngOnInit(): void {
    this.facade.cargarUsuarios();
  }

  onDesbloquear(id: string): void {
    this.facade.desbloquearCuenta(id);
  }

  onBloquear(id: string): void {
    this.facade.desactivarUsuario(id);
  }
}
