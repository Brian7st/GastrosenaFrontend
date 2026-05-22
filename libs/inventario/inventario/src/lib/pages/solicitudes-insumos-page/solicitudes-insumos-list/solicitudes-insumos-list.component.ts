import { ChangeDetectionStrategy, Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  ButtonComponent,
  DataTableComponent,
  KpiCardComponent
} from '@restaurant/shared/ui';
import { AprobarSolicitudModalComponent } from '../../../components/aprobar-solicitud-modal/aprobar-solicitud-modal.component';

interface SolicitudInsumo {
  id: number;
  codigo: string;
  instructor: string;
  ficha: string;
  fecha: string;
  itemsCount: number;
  estado: 'ENVIADA' | 'APROBADA' | 'CERRADA';
  items?: { nombre: string; cantidad: string; icon: string }[];
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
    AprobarSolicitudModalComponent
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
      estado: 'ENVIADA',
      items: [
        { nombre: 'Harina de trigo', cantidad: '10 kg', icon: 'inventory_2' },
        { nombre: 'Aceite vegetal', cantidad: '5 L', icon: 'local_drink' },
        { nombre: 'Leche entera', cantidad: '12 L', icon: 'water_drop' }
      ]
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

  solicitudSeleccionada = signal<SolicitudInsumo | null>(null);

  onSearch(term: string): void    { console.log('Buscar:', term);    }
  onFilterEstado(v: string): void { console.log('Estado:', v);       }
  onFilterFecha(v: string): void  { console.log('Fecha:', v);        }
  onClearFilters(): void          { console.log('Limpiar filtros');  }

  onView(id: string | number): void {
    this.router.navigate(['/app/inventario/solicitudes-insumos-page', id, 'consolidacion']);
  }
  
  onApprove(id: number): void {
    const sol = this.solicitudes().find(s => s.id === id);
    if (sol) {
      this.solicitudSeleccionada.set(sol);
    }
  }

  onCloseModal(): void {
    this.solicitudSeleccionada.set(null);
  }

  onConfirmApprove(id: number): void {
    this.solicitudes.update(list => list.map(s => {
      if (s.id === id) {
        return { ...s, estado: 'APROBADA' };
      }
      return s;
    }));
    this.onCloseModal();
  }
}
