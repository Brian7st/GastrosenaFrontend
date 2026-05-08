import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-solicitudes-form',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './solicitudes-form.component.html',
  styleUrls: ['./solicitudes-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesFormComponent {
  // Datos mock del formulario para renderizado (según prototipo)
  fechaSolicitud = signal('2024-05-20');
  
  bienes = signal([
    {
      codigo: 'ALM-001',
      descripcion: 'Harina de Trigo x 50kg',
      um: 'Bto',
      cantidad: 2,
      valorUnitario: 150000,
      subtotal: 300000
    }
  ]);

  constructor(private router: Router) {}

  onCancel(): void {
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

  onSave(): void {
    console.log('Guardando solicitud...');
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

  onAddCuentadante(): void {
    console.log('Agregar cuentadante');
  }

  onAddBien(): void {
    this.bienes.update(items => [
      ...items,
      {
        codigo: 'ALM-' + String(items.length + 1).padStart(3, '0'),
        descripcion: 'Nuevo Bien',
        um: 'Und',
        cantidad: 1,
        valorUnitario: 0,
        subtotal: 0
      }
    ]);
  }

  onRemoveBien(index: number): void {
    this.bienes.update(items => items.filter((_, i) => i !== index));
  }
}
