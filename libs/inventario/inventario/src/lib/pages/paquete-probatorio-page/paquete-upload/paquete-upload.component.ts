import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-paquete-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './paquete-upload.component.html',
  styleUrls: ['./paquete-upload.component.scss'],
})
export class PaqueteUploadComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isDragging = signal<boolean>(false);
  selectedFile = signal<File | null>(null);
  uploading = signal<boolean>(false);

  // ── Drag & Drop Events ───────────────────────────────────────────────────
  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  // ── File Handling ────────────────────────────────────────────────────────
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    // Basic validation: only PDFs or images
    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      this.selectedFile.set(file);
    } else {
      alert('Solo se permiten archivos PDF o imágenes (JPG, PNG).');
    }
  }

  removeFile(): void {
    this.selectedFile.set(null);
  }

  // ── Actions ──────────────────────────────────────────────────────────────
  cerrarModal(): void {
    // Navigate relative to the parent (detail view)
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  subirDocumento(): void {
    if (!this.selectedFile()) return;
    
    this.uploading.set(true);
    
    // Simulate upload delay
    setTimeout(() => {
      this.uploading.set(false);
      this.cerrarModal();
      // En la vida real aquí emitiríamos un evento o actualizaríamos el store
    }, 1500);
  }
}
