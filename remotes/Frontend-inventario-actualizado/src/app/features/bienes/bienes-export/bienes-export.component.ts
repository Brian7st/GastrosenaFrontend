import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-bienes-export',
    imports: [CommonModule, FormsModule, RouterModule, LucideIconComponent],
    templateUrl: './bienes-export.component.html',
    styleUrls: ['./bienes-export.component.scss']
})
export class BienesExportComponent {
  formato = signal<'excel' | 'pdf' | 'csv'>('excel');
  estadoActivo = true;
  estadoBajoStock = false;

  exportRecientes = [
    { nombre: 'Inv_Bienes_Oct.xlsx', tiempo: 'Hace 2 horas', size: '4.2 MB' },
    { nombre: 'Reporte_BajoStock.pdf', tiempo: 'Ayer', size: '1.8 MB' }
  ];

  selectFormato(f: 'excel' | 'pdf' | 'csv'): void {
    this.formato.set(f);
  }

  generar(): void {
    console.log('Generando reporte en formato:', this.formato());
  }
}
