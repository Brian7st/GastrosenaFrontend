import { ChangeDetectionStrategy, Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  ButtonComponent,
  DataTableComponent,
  KpiCardComponent,
  PageHeaderComponent,
  SearchFilterComponent,
  SelectFilterComponent,
  StatusBadgeComponent
} from '@restaurant/shared/ui';

interface SolicitudInsumo {
  id: number;
  codigo: string;
  instructor: string;
  ficha: string;
  fecha: string;
  itemsCount: number;
  estado: 'ENVIADA' | 'APROBADA' | 'CERRADA';
}

@Component({
  selector: 'app-solicitudes-insumos-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    DataTableComponent,
    KpiCardComponent,
    PageHeaderComponent,
    SearchFilterComponent,
    SelectFilterComponent,
    StatusBadgeComponent
  ],
  templateUrl: './solicitudes-insumos-list.component.html',
  styleUrls: ['./solicitudes-insumos-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesInsumosListComponent {
  private router = inject(Router);

  // ─── Mock data fiel al prototipo de Bandeja de Aprobación ───────────
  solicitudes = signal<SolicitudInsumo[]>([
    {
      id: 1,
      codigo: 'SOL-2024-001',
      instructor: 'Carlos Ruiz',
      ficha: '2560892',
      fecha: '12 Oct',
      itemsCount: 3,
      estado: 'ENVIADA'
    },
    {
      id: 2,
      codigo: 'SOL-2024-002',
      instructor: 'Marta López',
      ficha: '2441029',
      fecha: '11 Oct',
      itemsCount: 5,
      estado: 'APROBADA'
    },
    {
      id: 3,
      codigo: 'SOL-2024-003',
      instructor: 'Jorge Méndez',
      ficha: '2339810',
      fecha: '10 Oct',
      itemsCount: 2,
      estado: 'CERRADA'
    },
    {
      id: 4,
      codigo: 'SOL-2024-004',
      instructor: 'Ana Silva',
      ficha: '2560892',
      fecha: '13 Oct',
      itemsCount: 8,
      estado: 'ENVIADA'
    },
    {
      id: 5,
      codigo: 'SOL-2024-005',
      instructor: 'Pedro Gómez',
      ficha: '2441029',
      fecha: '14 Oct',
      itemsCount: 1,
      estado: 'ENVIADA'
    }
  ]);

  // ─── KPIs calculados (4 tarjetas del prototipo) ────────────────────
  totalEnviadasPendientes = computed(() => this.solicitudes().filter(s => s.estado === 'ENVIADA').length);
  totalAprobadasHoy       = computed(() => this.solicitudes().filter(s => s.estado === 'APROBADA').length);
  totalCerradas           = computed(() => this.solicitudes().filter(s => s.estado === 'CERRADA').length);
  totalLibres             = computed(() => 3); // Valor estático por el momento, según la imagen

  // ─── Opciones filtros ──────────────────────────────────────────────
  estadoOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'ENVIADA',  label: 'Enviada'  },
    { value: 'APROBADA', label: 'Aprobada' },
    { value: 'CERRADA',  label: 'Cerrada'  },
  ];

  fechaOptions = [
    { value: '', label: 'Fecha (Rango)' },
    { value: 'rango1', label: '10 Oct 2024 - 12 Oct 2024' }
  ];

  // ─── Helpers ───────────────────────────────────────────────────────
  getInitials(nombre: string): string {
    if (!nombre) return '';
    return nombre
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  getAvatarColor(estado: string): string {
    switch (estado) {
      case 'ENVIADA': return 'avatar--blue';
      case 'APROBADA': return 'avatar--green';
      case 'CERRADA': return 'avatar--slate';
      default: return 'avatar--slate';
    }
  }

  onSearch(term: string): void    { console.log('Buscar:', term);    }
  onFilterEstado(v: string): void { console.log('Estado:', v);       }
  onFilterFecha(v: string): void  { console.log('Fecha:', v);        }
  onClearFilters(): void          { console.log('Limpiar filtros');  }

  onView(id: string | number): void {
    this.router.navigate(['/app/inventario/solicitudes-insumos-page', id, 'consolidacion']);
  }
  
  onApprove(id: string | number): void { console.log('Aprobar:', id); }
}
