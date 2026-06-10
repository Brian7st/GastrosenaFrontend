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
import { HttpClient } from '@angular/common/http';
import {
  PageHeaderComponent,
  InputComponent,
  ButtonComponent,
  LucideIconComponent,
  StatusBadgeComponent,
} from '@restaurant/shared/ui';
import { AuthService } from '@restaurant/shared/auth';
import { UsuariosService } from '@restaurant/usuarios';
import { I18nService } from '../../i18n/i18n.service';

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
  private readonly authService     = inject(AuthService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly fb              = inject(FormBuilder);
  protected readonly i18n          = inject(I18nService);
  private readonly http            = inject(HttpClient);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  readonly usuario   = this.authService.currentUser();
  readonly guardando = signal(false);
  readonly exito     = signal(false);
  readonly subiendo  = signal(false);
 readonly fotoUrl = signal<string | null>(
  localStorage.getItem(`fotoUrl_${this.usuario?.id}`) ?? null
);

  readonly iniciales = computed(() => {
    const nombre = this.usuario?.nombre ?? '';
    const partes = nombre.split(' ');
    return partes.length >= 2 ? partes[0][0] + partes[1][0] : nombre.slice(0, 2);
  });

  readonly infoForm = this.fb.group({
    nombre:    ['', Validators.required],
    apellidos: ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]],
    documento: ['', Validators.required],
    telefono:  ['', Validators.required],
  });

  readonly seguridadForm = this.fb.group({
    contrasenaActual: ['', Validators.required],
    nuevaContrasena:  ['', [Validators.required, Validators.minLength(6)]],
    confirmar:        ['', Validators.required],
  });

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
  this.usuariosService.obtenerPerfil().subscribe({
    next: (data) => {
      this.infoForm.patchValue({
        nombre:    data.nombre,
        apellidos: data.apellidos,
        email:     data.email,
        documento: data.documento,
        telefono:  data.telefono,
      });
      if ((data as any).fotoUrl) {
        this.fotoUrl.set((data as any).fotoUrl);
        localStorage.setItem(`fotoUrl_${this.usuario?.id}`, (data as any).fotoUrl);
      }
    },
    error: (err) => console.error('Error cargando perfil', err),
  });
}

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFotoChange(event: Event): void {
    console.log('onFotoChange llamado', event);
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.subiendo.set(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'GastroSena');

    fetch('https://api.cloudinary.com/v1_1/dryhub1jk/image/upload', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        this.fotoUrl.set(data.secure_url);
        this.usuariosService.
        actualizarFoto(this.usuario?.id ?? '', data.secure_url).subscribe({
          next: () => {
            this.subiendo.set(false);
            this.cargarPerfil();
          },
          error: () => {
            this.subiendo.set(false);
            alert('Error al guardar la foto');
          }
        });
      })
      .catch(() => {
        this.subiendo.set(false);
        alert('Error al subir la foto a Cloudinary');
      });
  }

  onGuardar(): void {
    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.exito.set(false);

    const perfilData = {
      nombre:    this.infoForm.value.nombre    ?? '',
      apellidos: this.infoForm.value.apellidos ?? '',
      email:     this.infoForm.value.email     ?? '',
      documento: this.infoForm.value.documento ?? '',
      telefono:  this.infoForm.value.telefono  ?? '',
    };

    this.usuariosService.actualizarPerfil(perfilData).subscribe({
      next: () => {
        this.guardando.set(false);
        this.exito.set(true);
        setTimeout(() => this.exito.set(false), 3000);
        this.cargarPerfil();
      },
      error: (err) => {
        this.guardando.set(false);
        console.error('Error al actualizar perfil', err);
        alert('Error al guardar los datos');
      },
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