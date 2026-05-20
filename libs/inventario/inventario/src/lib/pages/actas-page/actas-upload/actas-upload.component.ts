import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-actas-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './actas-upload.component.html',
  styleUrl: './actas-upload.component.scss',
})
export class ActasUploadComponent {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  isDragging          = signal(false);
  archivoSeleccionado = signal<File | null>(null);
  errorArchivo        = signal<string | null>(null);
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.validarYSetearArchivo(file);
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.validarYSetearArchivo(file);
  }
  private validarYSetearArchivo(file: File): void {
    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!tiposPermitidos.includes(file.type)) {
      this.errorArchivo.set('Solo se permiten archivos PDF, JPG o PNG.');
      return;
    }
    this.errorArchivo.set(null);
    this.archivoSeleccionado.set(file);
  }
  cerrar(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
