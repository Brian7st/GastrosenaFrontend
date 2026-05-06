import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'restaurant-factura-import',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './factura-import.component.html',
  styleUrl: './factura-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaImportPageComponent {
  // State signals
  fileLoaded = signal(false);
  isDragOver = signal(false);

  constructor(private router: Router) {}

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver.set(false);
    if (e.dataTransfer?.files.length) {
      this.simulateLoad();
    }
  }

  onFileInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) {
      this.simulateLoad();
    }
  }

  simulateLoad(): void {
    // In a real app, we would parse the XML here.
    // We mock the transition to show the loaded data.
    this.fileLoaded.set(true);
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/facturas']);
  }
}
