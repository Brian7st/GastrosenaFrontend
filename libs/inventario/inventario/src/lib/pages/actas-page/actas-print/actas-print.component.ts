import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ActasFacade } from '../../../data-access/actas.facade';

@Component({
  selector: 'restaurant-actas-print',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './actas-print.component.html',
  styleUrl: './actas-print.component.scss',
})
export class ActasPrintComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private facade = inject(ActasFacade);

  acta     = this.facade.actaSeleccionada;
  loading  = this.facade.loading;

  /** Instructor Cuentadante: nombre tomado de la lista de asistentes */
  instructorNombre = computed(() => {
    const a = this.acta();
    if (!a) return a?.instructorId ?? '';
    const firmante = a.asistentes?.find(as =>
      as.dependenciaRol.toLowerCase().includes('instructor')
    );
    return firmante?.nombre || a.instructorId;
  });

  /** Fecha formateada: "ARMENIA, 29 DE JULIO DEL 2025" */
  fechaFormateada = computed(() => {
    const a = this.acta();
    if (!a) return '';
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

  /** Hora formateada: "HH:MM AM/PM" */
  formatHora(hora: string | undefined): string {
    if (!hora) return '—';
    const [h, m] = hora.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12  = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarActa(id);
    } else {
      this.router.navigate(['/app/inventario/actas']);
    }
  }

  imprimir(): void {
    window.print();
  }

  volver(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/app/inventario/actas', id]);
  }
}
