import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  PageHeaderComponent,
  InputComponent,
  ButtonComponent,
  LucideIconComponent,
  StatusBadgeComponent,
} from '@restaurant/shared/ui';
import { AuthService } from '@restaurant/shared/auth';
import { UsuariosService } from '@restaurant/usuarios'; // Asegúrate que el barrel exporte el servicio

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
  ],
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly fb = inject(FormBuilder);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  readonly usuario = this.authService.currentUser();
  readonly fotoUrl = signal<string | null>(null);

  readonly iniciales = computed(() => {
    const nombre = this.usuario?.nombre ?? '';
    const partes = nombre.split(' ');
    return partes.length >= 2 ? partes[0][0] + partes[1][0] : nombre.slice(0, 2);
  });

  readonly infoForm = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    documento: ['', Validators.required],
    telefono: ['', Validators.required],
  });

  readonly seguridadForm = this.fb.group({
    contrasenaActual: ['', Validators.required],
    nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
    confirmar: ['', Validators.required],
  });

  readonly guardando = signal(false);
  readonly exito = signal(false);

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.usuariosService.obtenerPerfil().subscribe({
      next: (data) => {
        this.infoForm.patchValue({
          nombre: data.nombre,
          apellidos: data.apellidos,
          email: data.email,
          documento: data.documento,
          telefono: data.telefono,
        });
      },
      error: (err) => console.error('Error cargando perfil', err),
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFotoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => this.fotoUrl.set(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

onGuardar(): void {
  if (this.infoForm.invalid) {
    this.infoForm.markAllAsTouched();
    return;
  }
  this.guardando.set(true);
  this.exito.set(false);

  // Construimos un objeto con los valores del formulario, asegurando que no haya null
  const perfilData = {
    nombre: this.infoForm.value.nombre ?? '',
    apellidos: this.infoForm.value.apellidos ?? '',
    email: this.infoForm.value.email ?? '',
    documento: this.infoForm.value.documento ?? '',
    telefono: this.infoForm.value.telefono ?? ''
  };

  this.usuariosService.actualizarPerfil(perfilData).subscribe({
    next: () => {
      this.guardando.set(false);
      this.exito.set(true);
      setTimeout(() => this.exito.set(false), 3000);
      this.cargarPerfil(); // refrescar datos
    },
    error: (err) => {
      this.guardando.set(false);
      console.error('Error al actualizar perfil', err);
      alert('Error al guardar los datos');
    }
  });
}

  onCambiarContrasena(): void {
    const form = this.seguridadForm;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    const { contrasenaActual, nuevaContrasena, confirmar } = form.value;
    if (nuevaContrasena !== confirmar) {
      alert('Las contraseñas nuevas no coinciden');
      return;
    }
    this.guardando.set(true);
    this.usuariosService
      .cambiarContrasena(contrasenaActual!, nuevaContrasena!)
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.exito.set(true);
          form.reset();
          setTimeout(() => this.exito.set(false), 3000);
        },
        error: () => {
          this.guardando.set(false);
          alert('Error al cambiar contraseña. Verifique la contraseña actual.');
        },
      });
  }

  onCancelar(): void {
    this.cargarPerfil();
    this.seguridadForm.reset();
  }
}