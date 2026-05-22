import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Bien, MovimientoBien } from '../../../models/inventario.model';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { StatusBadgeComponent } from '@restaurant/shared/ui';
import { BienFormComponent } from '../../modals/bien-form/bien-form.component';
import { BienFormDto, EstadoBien } from '../../../models/inventario.model';
import { MOVIMIENTOS_MOCK } from '../../../models/inventario.mock';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

@Component({
  selector: 'restaurant-bien-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BienFormComponent, BackButtonComponent, StatusBadgeComponent],
  templateUrl: './bien-detail.component.html',
  styleUrl: './bien-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private facade = inject(InventarioFacade);

  bien = this.facade.bienSeleccionado;
  loading = this.facade.loading;
  movimientos = signal<MovimientoBien[]>([]);
  showEditModal = signal(false);
  mostrarTodasFacturas = signal(false);

  readonly FACTURAS_PREVIEW_COUNT = 3;

  toggleFacturas(): void {
    this.mostrarTodasFacturas.update(v => !v);
  }

  espec = computed(() => {
    const b = this.bien();
    return b?.especificaciones ? Object.entries(b.especificaciones) : [];
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(id);
    }
  }

  private loadData(id: string): void {
    this.facade.cargarBienPorId(id);
    this.movimientos.set(MOVIMIENTOS_MOCK);
  }

  onVolver(): void {
    this.router.navigate(['/app/inventario/bienes']);
  }

  onEditarActivo(): void {
    this.showEditModal.set(true);
  }

  onSaveEdit(dto: BienFormDto): void {
    if (this.bien()) {
      this.facade.actualizarBien(this.bien()!.id, dto);
    }
    this.showEditModal.set(false);
  }

  onExportarHistorial(): void {
    this.router.navigate(['/app/inventario/bienes/exportar']);
  }

  getTipoClass(tipo: string): string {
    const map: Record<string, string> = { 'ENTRADA': 'entrada', 'SALIDA': 'salida', 'TRASLADO': 'traslado' };
    return map[tipo] ?? '';
  }


  getCantidadPrefix(cantidad: number): string {
    if (cantidad > 0) return `+${cantidad}`;
    if (cantidad < 0) return `${cantidad}`;
    return '0';
  }

  getCantidadClass(cantidad: number): string {
    if (cantidad > 0) return 'cantidad--positiva';
    if (cantidad < 0) return 'cantidad--negativa';
    return '';
  }

  getEstadoFacturaClass(estado: string): string {
    const map: Record<string, string> = { 'PAGADA': 'factura-estado--pagada', 'CAUSADA': 'factura-estado--causada', 'PENDIENTE': 'factura-estado--pendiente' };
    return map[estado] ?? '';
  }

  getEstadoPillClass(estado: EstadoBien): string {
    const map: Record<EstadoBien, string> = {
      'Activo': 'estado-pill--activo',
      'Bajo Stock': 'estado-pill--bajo',
      'Agotado': 'estado-pill--agotado',
      'Inactivo': 'estado-pill--inactivo'
    };
    return map[estado] || '';
  }

  // ── StatusBadge helpers ─────────────────────────────────────────────────────
  getEstadoVariant(estado: EstadoBien): 'success' | 'warning' | 'danger' | 'neutral' {
    const map: Record<EstadoBien, 'success' | 'warning' | 'danger' | 'neutral'> = {
      'Activo':    'success',
      'Bajo Stock': 'warning',
      'Agotado':   'danger',
      'Inactivo':  'neutral',
    };
    return map[estado] ?? 'neutral';
  }

  getTipoVariant(tipo: string): 'success' | 'danger' | 'warning' | 'neutral' {
    const map: Record<string, 'success' | 'danger' | 'warning' | 'neutral'> = {
      'ENTRADA':  'success',
      'SALIDA':   'danger',
      'TRASLADO': 'warning',
    };
    return map[tipo] ?? 'neutral';
  }

  getFacturaEstadoVariant(estado: string): 'success' | 'warning' | 'neutral' {
    const map: Record<string, 'success' | 'warning' | 'neutral'> = {
      'PAGADA':    'success',
      'CAUSADA':   'warning',
      'PENDIENTE': 'neutral',
    };
    return map[estado] ?? 'neutral';
  }
}
