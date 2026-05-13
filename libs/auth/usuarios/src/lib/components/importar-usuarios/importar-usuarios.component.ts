import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { ImportarUsuariosRequest } from '../../models/usuarios.model';

@Component({
  selector: 'restaurant-importar-usuarios',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideIconComponent],
  templateUrl: './importar-usuarios.component.html',
  styleUrl:    './importar-usuarios.component.scss',
})
export class ImportarUsuariosComponent {
  @Output() cerrar   = new EventEmitter<void>();
  @Output() importar = new EventEmitter<ImportarUsuariosRequest>();

  readonly isDragging = signal(false);
  readonly archivo    = signal<File | null>(null);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.archivo.set(file);
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.archivo.set(file);
  }

  onImportar(): void {
    const file = this.archivo();
    if (!file) return;
    this.importar.emit({ archivo: file, tipo: 'INSTRUCTOR' });
  }
}
