import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
} from '@angular/core';
import { CommonModule, UpperCasePipe, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  StatusBadgeComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';
import {
  ActaLegalizacion,
  ActaEstado,
  InsumoActa,
  CompromisoActa,
  FirmanteActa,
  MOCK_ACTAS,
  MOCK_INSUMOS,
  MOCK_COMPROMISOS,
  MOCK_FIRMANTES,
} from '../../../models/acta.model';

@Component({
  selector: 'restaurant-actas-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    UpperCasePipe,
    CurrencyPipe,
    StatusBadgeComponent,
    LucideIconComponent,
  ],
  templateUrl: './actas-detail.component.html',
  styleUrls: ['./actas-detail.component.scss'],
})
export class ActasDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // ── Estado reactivo ──────────────────────────────────────────────────────
  acta = signal<ActaLegalizacion>(MOCK_ACTAS[0]);
  insumos = signal<InsumoActa[]>(MOCK_INSUMOS);
  compromisos = signal<CompromisoActa[]>(MOCK_COMPROMISOS);
  firmantes = signal<FirmanteActa[]>(MOCK_FIRMANTES);

  // ── Cálculos monetarios ──────────────────────────────────────────────────
  subtotal = computed(() =>
    this.insumos().reduce((sum, i) => sum + i.cantidad * i.costoUnitario, 0)
  );

  iva = computed(() => this.subtotal() * 0.05);

  total = computed(() => this.subtotal() + this.iva());

  constructor() {
    // Cargar acta según parámetro de ruta
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = MOCK_ACTAS.find(a => a.id === id);
      if (found) {
        this.acta.set(found);
      }
    }
  }

  // ── Helpers de UI ────────────────────────────────────────────────────────
  getEstadoLabel(estado: ActaEstado): string {
    const map: Record<ActaEstado, string> = {
      borrador: 'Borrador',
      pendiente: 'Pendiente Aprobación',
      firmada: 'Firmada',
      revisada: 'Revisada',
      archivada: 'Archivada',
    };
    return map[estado];
  }

  getEstadoVariant(estado: ActaEstado): 'success' | 'warning' | 'danger' | 'info' {
    const map: Record<ActaEstado, 'success' | 'warning' | 'danger' | 'info'> = {
      borrador: 'info',
      pendiente: 'warning',
      firmada: 'info',
      revisada: 'success',
      archivada: 'info',
    };
    return map[estado];
  }

  // ── Navegación ─────────────────────────────────────────────────────────
  volver(): void {
    this.router.navigate(['/app/inventario/actas']);
  }

  cambiarEstado(): void {
    // Placeholder para lógica futura
  }
}
