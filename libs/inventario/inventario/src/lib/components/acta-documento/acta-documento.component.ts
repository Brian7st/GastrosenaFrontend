import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ActaLegalizacion } from '../../models/acta.model';

/**
 * Componente presentacional del formato oficial GOR-F-084 V02 del acta de
 * legalización. Recibe el acta y renderiza el documento; lo usan tanto la vista
 * de detalle (en pantalla) como la vista de impresión.
 */
@Component({
  selector: 'inventario-acta-documento',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperCasePipe],
  templateUrl: './acta-documento.component.html',
  styleUrl: './acta-documento.component.scss',
})
export class ActaDocumentoComponent {
  readonly acta = input.required<ActaLegalizacion>();

  /** Instructor Cuentadante: nombre tomado de la lista de asistentes. */
  readonly instructorNombre = computed(() => {
    const a = this.acta();
    const firmante = a.asistentes?.find(as =>
      as.dependenciaRol.toLowerCase().includes('instructor')
    );
    return firmante?.nombre || a.instructorId;
  });

  /** Fecha formateada: "ARMENIA, 29 DE JULIO DEL 2025". */
  readonly fechaFormateada = computed(() => {
    const a = this.acta();
    const ciudad = (a.ciudad ?? 'Armenia').toUpperCase();
    const raw = a.fecha; // ISO "2025-07-29"
    try {
      const d = new Date(raw + 'T00:00:00');
      const dia = d.getDate();
      const mes = d.toLocaleDateString('es-CO', { month: 'long' }).toUpperCase();
      const anio = d.getFullYear();
      return `${ciudad}, ${dia} DE ${mes} DEL ${anio}`;
    } catch {
      return `${ciudad}, ${raw}`;
    }
  });

  /** Hora formateada: "HH:MM AM/PM". */
  formatHora(hora: string | undefined): string {
    if (!hora) return '—';
    const [h, m] = hora.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  }
}
