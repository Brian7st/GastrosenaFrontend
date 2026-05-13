import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent } from '@restaurant/shared/ui';
import { SolicitudGil } from '../../../models/solicitudes-gil.model';

@Component({
  selector: 'app-solicitudes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, DataTableComponent, KpiCardComponent],
  templateUrl: './solicitudes-list.component.html',
  styleUrls: ['./solicitudes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesListComponent {

  // ─── Mock data fielado al prototipo ────────────────────────────────────────
  solicitudes = signal<SolicitudGil[]>([
    {
      id: 1,
      codigo: 'GIL-F-014-2024-001',
      fecha: '24 Oct, 2024',
      centroCostos: 'CBA Mosquera',
      area: 'Gastronomía',
      cuentadante: 'Carlos Alberto Ruiz',
      destino: 'Cocina Principal',
      ficha: 'ADSO-2670687',
      estado: 'Borrador',
      totalBienes: 8,
      montoTotal: 1240000,
      avatarColor: 'blue',
    },
    {
      id: 2,
      codigo: 'GIL-F-014-2024-002',
      fecha: '22 Oct, 2024',
      centroCostos: 'CBA Mosquera',
      area: 'Mantenimiento',
      cuentadante: 'Martha Lucía Gomez',
      destino: 'Taller Técnico',
      ficha: 'MANT-2550122',
      estado: 'Pendiente',
      totalBienes: 5,
      montoTotal: 450500,
      avatarColor: 'purple',
    },
    {
      id: 3,
      codigo: 'GIL-F-014-2024-003',
      fecha: '20 Oct, 2024',
      centroCostos: 'CBA Mosquera',
      area: 'Gestión Empresarial',
      cuentadante: 'Fernando Vallejo',
      destino: 'Aula 301',
      ficha: 'GEST-2899341',
      estado: 'Validado',
      totalBienes: 12,
      montoTotal: 2890000,
      avatarColor: 'amber',
    },
    {
      id: 4,
      codigo: 'GIL-F-014-2024-004',
      fecha: '18 Oct, 2024',
      centroCostos: 'CBA Mosquera',
      area: 'Gastronomía',
      cuentadante: 'Lucía Mercedes Prada',
      destino: 'Cocina Caliente',
      ficha: 'ADSO-2670687',
      estado: 'Aprobado',
      totalBienes: 20,
      montoTotal: 3150000,
      avatarColor: 'green',
    },
    {
      id: 5,
      codigo: 'GIL-F-014-2024-005',
      fecha: '15 Oct, 2024',
      centroCostos: 'CBA Mosquera',
      area: 'Mantenimiento',
      cuentadante: 'Roberto Jaramillo',
      destino: 'Laboratorio',
      ficha: 'MANT-2550122',
      estado: 'Procesado',
      totalBienes: 6,
      montoTotal: 890000,
      avatarColor: 'slate',
    },
  ]);

  // ─── KPIs calculados (4 tarjetas del prototipo) ────────────────────────────
  totalSolicitudes   = computed(() => this.solicitudes().length);
  totalBorradores    = computed(() => this.solicitudes().filter(s => s.estado === 'Borrador').length);
  enTramite          = computed(() => this.solicitudes().filter(s => s.estado === 'Pendiente' || s.estado === 'Validado').length);
  finalizadas        = computed(() => this.solicitudes().filter(s => s.estado === 'Aprobado' || s.estado === 'Procesado').length);

  // ─── Opciones filtros ──────────────────────────────────────────────────────
  estadoOptions = [
    { value: '', label: 'Filtrar por Estado' },
    { value: 'Borrador',  label: 'Borrador'  },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Validado',  label: 'Validado'  },
    { value: 'Aprobado',  label: 'Aprobado'  },
    { value: 'Procesado', label: 'Procesado' },
  ];

  fechaOptions = [
    { value: '', label: 'Filtrar por Fecha' },
    { value: '7d',    label: 'Últimos 7 días' },
    { value: 'mes',   label: 'Este mes'       },
    { value: '2024',  label: 'Año 2024'       },
  ];

  // ─── Helpers ───────────────────────────────────────────────────────────────
  getInitials(nombre: string): string {
    return nombre
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  formatCOP(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  /** Editar solo está habilitado en Borrador o Pendiente */
  canEdit(estado: string): boolean {
    return estado === 'Borrador' || estado === 'Pendiente';
  }

  onSearch(term: string): void    { console.log('Buscar:', term);    }
  onFilterEstado(v: string): void { console.log('Estado:', v);       }
  onFilterFecha(v: string): void  { console.log('Fecha:', v);        }
  onExportPdf(id: string | number): void { console.log('PDF:', id);  }

  // ── Modal State ──────────────────────────────────────────────────────────
  showDeleteModal = signal<boolean>(false);
  itemToDelete = signal<any>(null);
  deleteBlocked = signal<boolean>(false);

  // ── Actions ──────────────────────────────────────────────────────────────
  onDelete(item: any): void {
    this.itemToDelete.set(item);
    // Simulating block logic: Only 'Borrador' can be deleted
    if (item.estado !== 'Borrador') {
      this.deleteBlocked.set(true);
    } else {
      this.deleteBlocked.set(false);
    }
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.itemToDelete.set(null);
  }

  confirmDelete(): void {
    // Implement actual delete logic here
    const id = this.itemToDelete()?.codigo;
    this.solicitudes.update(list => list.filter(item => item.codigo !== id));
    this.closeDeleteModal();
  }
}
