import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

@Component({
  selector: 'restaurant-solicitudes-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  templateUrl: './solicitudes-detail.component.html',
  styleUrl: './solicitudes-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesDetailComponent {
  
  // ─── Mocks basados en prototipo ─────────────────────────
  solicitudId = signal<string>('GIL-F-014-2024-001');
  estadoActual = signal<'Borrador' | 'Pendiente' | 'Validado' | 'Aprobado' | 'Procesado'>('Borrador');
  fechaCreacion = signal('24 Oct 2024');
  totalEstimado = signal(1240000);

  constructor(private router: Router, private route: ActivatedRoute) {
    // Si viene un ID en la ruta, podríamos cargarlo (mock behavior)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.solicitudId.set(`GIL-F-014-2024-00${idParam}`);
    }
  }

  // ─── Helpers para el Timeline ───────────────────────────
  estados = ['Borrador', 'Pendiente', 'Validado', 'Aprobado', 'Procesado'];

  getIcon(estado: string): string {
    const iconos: Record<string, string> = {
      Borrador: 'edit_document',
      Pendiente: 'hourglass_empty',
      Validado: 'fact_check',
      Aprobado: 'thumb_up',
      Procesado: 'check_circle'
    };
    return iconos[estado] || 'help';
  }

  isPast(estado: string): boolean {
    const currentIndex = this.estados.indexOf(this.estadoActual());
    const targetIndex = this.estados.indexOf(estado);
    return targetIndex < currentIndex;
  }

  isActive(estado: string): boolean {
    return this.estadoActual() === estado;
  }

  // ─── Handlers de acciones ───────────────────────────────
  onVolver(): void {
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

  onEditar(): void {
    const rawId = this.solicitudId().split('-').pop(); // Mock extract '001'
    this.router.navigate(['/app/inventario/solicitudes-gil', rawId, 'editar']);
  }

  onDownloadPdf(): void {
    console.log('Descargando PDF...');
  }

  onEnviarAprobacion(): void {
    // Mock action
    if(this.estadoActual() === 'Borrador') {
      this.estadoActual.set('Pendiente');
    }
  }
}
