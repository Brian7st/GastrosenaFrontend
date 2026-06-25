import { ChangeDetectionStrategy, Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BienFormDto, EstadoBien } from '../../../models/inventario.model';
import { Movimiento } from '../../../models/movimiento.model';
import { MovimientosService } from '../../../data-access/services/movimientos.service';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { ButtonComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { BienFormComponent } from '../../../ui/modals/bien-form/bien-form.component';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

@Component({
  selector: 'restaurant-bien-detail',
  standalone: true,
  imports: [CommonModule, BienFormComponent, BackButtonComponent, StatusBadgeComponent, ButtonComponent],
  templateUrl: './bien-detail.component.html',
  styleUrl: './bien-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private facade = inject(InventarioFacade);
  private movimientosService = inject(MovimientosService);

  bien = this.facade.bienSeleccionado;
  loading = this.facade.loading;
  movimientos = signal<Movimiento[]>([]);
  showEditModal = signal(false);

  private codigoCargado: string | null = null;

  constructor() {
    // Cuando el bien queda cargado, traemos su kardex (entradas, salidas y ajustes)
    // por codigoSena — el productoId canónico del sistema.
    effect(() => {
      const codigo = this.bien()?.codigoSena;
      if (codigo && codigo !== this.codigoCargado) {
        this.codigoCargado = codigo;
        this.movimientosService.getKardex(codigo, 0, 50).subscribe({
          next: r => this.movimientos.set(r.movimientos),
          error: () => this.movimientos.set([]),
        });
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.facade.cargarBienPorId(id);
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

  /** Un movimiento resta stock si es salida, liberación o ajuste negativo. */
  private esNegativo(tipo: string): boolean {
    return tipo === 'SALIDA' || tipo === 'LIBERACION' || tipo === 'AJUSTE_NEGATIVO';
  }

  getCantidadPrefix(m: Movimiento): string {
    return this.esNegativo(m.tipo) ? `-${m.cantidad}` : `+${m.cantidad}`;
  }

  getCantidadClass(m: Movimiento): string {
    return this.esNegativo(m.tipo) ? 'cantidad--negativa' : 'cantidad--positiva';
  }

  getSigno(m: Movimiento): string {
    return this.esNegativo(m.tipo) ? '-' : '+';
  }

  getTipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      ENTRADA: 'Entrada',
      SALIDA: 'Salida',
      RESERVA: 'Reserva',
      LIBERACION: 'Liberación',
      AJUSTE: 'Ajuste',
      AJUSTE_POSITIVO: 'Ajuste (+)',
      AJUSTE_NEGATIVO: 'Ajuste (−)',
    };
    return map[tipo] ?? tipo;
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
    if (tipo === 'ENTRADA' || tipo === 'AJUSTE_POSITIVO') return 'success';
    if (tipo === 'SALIDA' || tipo === 'AJUSTE_NEGATIVO' || tipo === 'LIBERACION') return 'danger';
    if (tipo === 'RESERVA') return 'warning';
    return 'neutral';
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
