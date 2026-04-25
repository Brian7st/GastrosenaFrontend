import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { SolicitudGilCompleta, SOLICITUD_GIL_DETALLE_MOCK } from '../models/solicitud-gil.model';

@Component({
    selector: 'app-solicitudes-gil-detail',
    imports: [CommonModule, RouterModule, LucideIconComponent],
    templateUrl: './solicitudes-gil-detail.component.html',
    styleUrls: ['./solicitudes-gil-detail.component.scss']
})
export class SolicitudesGilDetailComponent {
  solicitud = signal<SolicitudGilCompleta>(SOLICITUD_GIL_DETALLE_MOCK);

  timelineSteps = [
    { label: 'Borrador', icon: 'file-text', active: true },
    { label: 'Pendiente', icon: 'clock', active: false },
    { label: 'Validado', icon: 'file-check', active: false },
    { label: 'Aprobado', icon: 'thumbs-up', active: false },
    { label: 'Procesado', icon: 'check-circle', active: false }
  ];

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-CO');
  }
}
