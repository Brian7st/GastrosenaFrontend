import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-solicitudes-gil-pdf',
    imports: [CommonModule, RouterModule, LucideIconComponent],
    templateUrl: './solicitudes-gil-pdf.component.html',
    styleUrls: ['./solicitudes-gil-pdf.component.scss']
})
export class SolicitudesGilPdfComponent {
  items = [
    { num: '01', descripcion: 'Portátil Corporativo Core i7 16GB RAM - Serial: SN-9283-A', unidad: 'UND', cantidad: '05', observaciones: 'Asignación Aula 402' },
    { num: '02', descripcion: 'Monitor Ultrawide 34" Curvo para Diseño Gráfico', unidad: 'UND', cantidad: '02', observaciones: 'Reposición por daño' },
    { num: '03', descripcion: 'Silla Ergonómica con Soporte Lumbar Ajustable', unidad: 'UND', cantidad: '10', observaciones: 'Dotación personal planta' }
  ];
}
