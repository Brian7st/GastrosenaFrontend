import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { FichasService } from '../../../data-access/fichas.service';
import { UsuariosService } from '../../../data-access/usuarios.service';
import { UsuarioFichaService } from '../../../data-access/usuario-ficha.service';
import { Ficha } from '../../../models/ficha.model';
import { Usuario } from '@restaurant/shared/models';
 
@Component({
  selector: 'restaurant-ficha-detalle',
  standalone: true,
  imports: [LucideIconComponent],
  templateUrl: './ficha-detalle.component.html',
  styleUrls: ['./ficha-detalle.component.scss']
})
export class FichaDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fichasService = inject(FichasService);
  private usuariosService = inject(UsuariosService);
  private usuarioFichaService = inject(UsuarioFichaService);
 
  fichaId = signal<string>('');
  ficha = signal<Ficha | null>(null);
  aprendices = signal<Usuario[]>([]);
  voceroId = signal<string | null>(null);
  subvoceroId = signal<string | null>(null);
  loading = signal(false);
 
  mostrarModalAsignar = signal(false);
  busquedaAprendiz = signal('');
  usuariosDisponibles = signal<Usuario[]>([]);
 
  // Filtra los usuarios disponibles según la búsqueda en tiempo real
  usuariosDisponiblesFiltrados = computed(() => {
    const q = this.busquedaAprendiz().toLowerCase().trim();
    if (!q) return this.usuariosDisponibles();
    return this.usuariosDisponibles().filter(u =>
      u.nombre.toLowerCase().includes(q) ||
      u.apellidos?.toLowerCase().includes(q) ||
      u.documento?.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });
 
  ngOnInit() {
    this.fichaId.set(this.route.snapshot.paramMap.get('id')!);
    this.cargarFicha();
    this.cargarAprendices();
  }
 
  cargarFicha() {
    this.fichasService.obtenerFichaPorId(this.fichaId()).subscribe({
      next: (data) => this.ficha.set(data),
      error: (err) => console.error('Error cargando ficha:', err)
    });
  }
 
cargarAprendices() {
  this.loading.set(true);
  this.usuarioFichaService.getAprendicesByFicha(this.fichaId()).subscribe({
    next: (aprendices) => {
      // Mapear idUsuario → id igual que en obtenerAprendices
      const mapeados = aprendices.map((u: any) => ({
        ...u,
        id: u.idUsuario ?? u.id,
        activo: u.estado ?? u.activo,
        rol: u.rol?.nombreRol ?? u.rol,
      }));
      this.aprendices.set(mapeados);
      this.cargarRoles();
      this.loading.set(false);
    },
    error: (err) => {
      console.error('Error cargando aprendices:', err);
      this.loading.set(false);
    }
  });
}
 
cargarRoles() {
  this.usuarioFichaService.getVocero(this.fichaId()).subscribe({
    next: (vocero: any) => this.voceroId.set(vocero?.idUsuario ?? vocero?.id ?? null),
    error: () => this.voceroId.set(null)
  });
  this.usuarioFichaService.getSubvocero(this.fichaId()).subscribe({
    next: (subvocero: any) => this.subvoceroId.set(subvocero?.idUsuario ?? subvocero?.id ?? null),
    error: () => this.subvoceroId.set(null)
  });
}
 
  esVocero(usuarioId: string): boolean {
    return this.voceroId() === usuarioId;
  }
 
  esSubvocero(usuarioId: string): boolean {
    return this.subvoceroId() === usuarioId;
  }
 
  getNombreAprendiz(usuarioId: string): string {
    const aprendiz = this.aprendices().find(a => a.id === usuarioId);
    return aprendiz ? `${aprendiz.nombre} ${aprendiz.apellidos ?? ''}`.trim() : '';
  }
 
  asignarVocero(usuarioId: string) {
    this.usuarioFichaService.asignarVocero(this.fichaId(), usuarioId).subscribe({
      next: () => {
        this.voceroId.set(usuarioId);
        // Si era subvocero, quitar ese rol localmente
        if (this.subvoceroId() === usuarioId) this.subvoceroId.set(null);
      },
      error: (err) => console.error('Error asignando vocero:', err)
    });
  }
 
  asignarSubvocero(usuarioId: string) {
    this.usuarioFichaService.asignarSubvocero(this.fichaId(), usuarioId).subscribe({
      next: () => {
        this.subvoceroId.set(usuarioId);
        // Si era vocero, quitar ese rol localmente
        if (this.voceroId() === usuarioId) this.voceroId.set(null);
      },
      error: (err) => console.error('Error asignando subvocero:', err)
    });
  }
 
  removerRol(usuarioId: string) {
    this.usuarioFichaService.removerRol(this.fichaId(), usuarioId).subscribe({
      next: () => {
        if (this.voceroId() === usuarioId) this.voceroId.set(null);
        if (this.subvoceroId() === usuarioId) this.subvoceroId.set(null);
      },
      error: (err) => console.error('Error removiendo rol:', err)
    });
  }
 
  abrirModalAsignar() {
    this.mostrarModalAsignar.set(true);
    this.busquedaAprendiz.set('');
    this.cargarUsuariosDisponibles();
  }
 
  cerrarModalAsignar() {
    this.mostrarModalAsignar.set(false);
    this.busquedaAprendiz.set('');
  }
 
  cargarUsuariosDisponibles() {
    this.usuariosService.obtenerAprendices().subscribe({
      next: (usuarios) => {
        const asignadosIds = new Set(this.aprendices().map(a => a.id));
        this.usuariosDisponibles.set(
          usuarios.filter(u => !asignadosIds.has(u.id))
        );
      },
      error: (err) => console.error('Error cargando usuarios disponibles:', err)
    });
  }
 
  asignarAprendiz(usuarioId: string) {
    this.usuarioFichaService.asignarAprendiz(this.fichaId(), usuarioId).subscribe({
      next: () => {
        this.cerrarModalAsignar();
        this.cargarAprendices(); // recarga completa para reflejar el nuevo aprendiz
      },
      error: (err) => console.error('Error asignando aprendiz:', err)
    });
  }
 
  volver() {
    this.router.navigate(['/app/usuarios/fichas']);
  }
}