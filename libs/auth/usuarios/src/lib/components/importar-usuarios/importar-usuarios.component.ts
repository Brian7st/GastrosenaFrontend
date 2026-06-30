import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { I18nService } from '../../i18n/i18n.service';
import {
  ImportarUsuariosRequest,
  ImportarUsuariosResponse,
} from '../../models/usuarios.model';

@Component({
  selector: 'restaurant-importar-usuarios',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideIconComponent],
  templateUrl: './importar-usuarios.component.html',
  styleUrl:    './importar-usuarios.component.scss',
})
export class ImportarUsuariosComponent {
  protected readonly i18n = inject(I18nService);
  @Output() cerrar   = new EventEmitter<void>();
  @Output() importar = new EventEmitter<ImportarUsuariosRequest>();

  @Input() resultado: ImportarUsuariosResponse | null = null;
  @Input() importando = false;

  readonly isDragging = signal(false);
  readonly archivo    = signal<File | null>(null);
  readonly tipo       = signal<'INSTRUCTOR' | 'APRENDIZ'>('INSTRUCTOR');

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

  onTipoChange(event: Event): void {
    this.tipo.set((event.target as HTMLSelectElement).value as 'INSTRUCTOR' | 'APRENDIZ');
  }

  onImportar(): void {
    const file = this.archivo();
    if (!file) return;
    this.importar.emit({ archivo: file, tipo: this.tipo() });
  }
}
