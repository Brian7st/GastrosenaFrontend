import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-solicitudes-gil-edit',
    imports: [CommonModule, FormsModule, RouterModule, LucideIconComponent],
    templateUrl: './solicitudes-gil-edit.component.html',
    styleUrls: ['./solicitudes-gil-edit.component.scss']
})
export class SolicitudesGilEditComponent {
  // Mock pre-filled data
  solicitud = {
    nombre: 'Carlos Alberto Ruiz',
    identificacion: '1.098.345.221',
    centroFormacion: 'Centro de Servicios y Gestión Empresarial',
    cargo: 'Instructor Técnico',
    descripcionEquipo: 'Portátil Dell Latitude 5420 - Procesador i7, 16GB RAM',
    placaInventario: 'SENA-IV-2023-456',
    numeroSerie: 'CZS984210L',
    estadoEntrega: 'Excelente',
    fechaAsignacion: '2023-05-15',
    vocero: '',
    cedulaVocero: '',
    resultadoAprendizaje: '',
    franjaHoraria: ''
  };
}
