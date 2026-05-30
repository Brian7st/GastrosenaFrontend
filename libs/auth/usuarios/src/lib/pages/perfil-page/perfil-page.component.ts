import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  PageHeaderComponent,
  InputComponent,
  ButtonComponent,
  LucideIconComponent,
  StatusBadgeComponent,
  AlertComponent,
} from '@restaurant/shared/ui';
import { AuthService } from '@restaurant/shared/auth';
import { PerfilFacade } from '../../data-access/perfil.facade';
import { ActualizarPerfilRequest, CambiarContrasenaRequest } from '../../models/perfil.model';

@Component({
  selector: 'restaurant-perfil-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    InputComponent,
    ButtonComponent,
    LucideIconComponent,
    StatusBadgeComponent,
    AlertComponent,
  ],
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly facade = inject(PerfilFacade);
  private readonly fb = inject(FormBuilder);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  readonly usuario = this.authService.currentUser();
  readonly fotoUrl = signal<string | null>(null);

  // ── Estado del facade ─────────────────────────────────────────────────────
  readonly perfil              = this.facade.perfil;
  readonly actividad           = this.facade.actividad;
  readonly cargando            = this.facade.cargando;
  readonly guardando           = this.facade.guardando;
  readonly cambiandoContrasena = this.facade.cambiandoContrasena;
  readonly error               = this.facade.error;
  readonly exito               = this.facade.exito;
  readonly iniciales           = this.facade.iniciales;

  readonly infoForm = this.fb.group({
    nombre:    [this.usuario?.nombre ?? '',  [Validators.required]],
    apellidos: ['',                           [Validators.required]],
    email:     [this.usuario?.email ?? '',   [Validators.required, Validators.email]],
    documento: ['',                           [Validators.required]],
    telefono:  ['',                           [Validators.required]],
  });

  readonly seguridadForm = this.fb.group({
    contrasenaActual: ['', [Validators.required]],
    nuevaContrasena:  ['', [Validators.required, Validators.minLength(6)]],
    confirmar:        ['', [Validators.required]],
  });

  ngOnInit(): void {
    const userId = this.usuario?.id;
    if (userId) {
      this.facade.cargarPerfil(userId);
      this.facade.cargarActividad(userId);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFotoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotoUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const userId = this.usuario?.id;
      if (userId) {
        this.facade.subirFoto(userId, file);
      }
    }
  }

  onGuardar(): void {
    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }
    const userId = this.usuario?.id;
    if (!userId) return;

    const data: ActualizarPerfilRequest = {
      nombre:    this.infoForm.value.nombre!,
      apellidos: this.infoForm.value.apellidos!,
      email:     this.infoForm.value.email!,
      telefono:  this.infoForm.value.telefono!,
    };
    this.facade.actualizarPerfil(userId, data);
  }

  onCambiarContrasena(): void {
    if (this.seguridadForm.invalid) {
      this.seguridadForm.markAllAsTouched();
      return;
    }
    const userId = this.usuario?.id;
    if (!userId) return;

    const data: CambiarContrasenaRequest = {
      contrasenaActual: this.seguridadForm.value.contrasenaActual!,
      nuevaContrasena:  this.seguridadForm.value.nuevaContrasena!,
      confirmar:        this.seguridadForm.value.confirmar!,
    };
    this.facade.cambiarContrasena(userId, data);
  }

  onCancelar(): void {
    this.infoForm.reset();
    this.seguridadForm.reset();
    this.facade.limpiarMensajes();
  }
}