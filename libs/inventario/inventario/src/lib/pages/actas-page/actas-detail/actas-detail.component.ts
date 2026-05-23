import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule, UpperCasePipe, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import {
  StatusBadgeComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { ActaEstado } from '../../../models/acta.model';
import { ActasFacade } from '../../../data-access/actas.facade';

@Component({
  selector: 'restaurant-actas-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    UpperCasePipe,
    CurrencyPipe,
    StatusBadgeComponent,
    LucideIconComponent,
    BackButtonComponent,
  ],
  templateUrl: './actas-detail.component.html',
  styleUrl: './actas-detail.component.scss',
})
export class ActasDetailComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private facade = inject(ActasFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  acta        = this.facade.actaSeleccionada;
  insumos     = this.facade.insumos;
  compromisos = this.facade.compromisos;
  firmantes   = this.facade.firmantes;
  loading     = this.facade.loading;

  // ── Cálculos monetarios ──────────────────────────────────────────────────
  subtotal = computed(() =>
    this.insumos().reduce((sum, i) => sum + i.cantidad * i.costoUnitario, 0)
  );

  iva   = computed(() => this.subtotal() * 0.19);
  total = computed(() => this.subtotal() + this.iva());

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarActa(id);
    } else {
      this.router.navigate(['/app/inventario/actas']);
    }
  }

  // ── Helpers de UI ────────────────────────────────────────────────────────
  getEstadoLabel(estado: ActaEstado): string {
    const map: Record<ActaEstado, string> = {
      BORRADOR:         'Borrador',
      PENDIENTE_FIRMAS: 'Pendiente Firmas',
      FIRMADA:          'Firmada',
      REVISADA:         'Revisada',
      ARCHIVADA:        'Archivada',
    };
    return map[estado];
  }

  getEstadoVariant(estado: ActaEstado): 'success' | 'warning' | 'danger' | 'info' {
    const map: Record<ActaEstado, 'success' | 'warning' | 'danger' | 'info'> = {
      BORRADOR:         'info',
      PENDIENTE_FIRMAS: 'warning',
      FIRMADA:          'success',
      REVISADA:         'success',
      ARCHIVADA:        'info',
    };
    return map[estado];
  }

  // ── Acciones ─────────────────────────────────────────────────────────────
  /** Avanza al siguiente estado del flujo. Acepta un estado explícito o lo calcula automáticamente. */
  cambiarEstado(nuevoEstado?: ActaEstado): void {
    const id    = this.acta()?.id;
    const estado = nuevoEstado ?? this.siguienteEstado();
    if (id && estado) this.facade.cambiarEstado(id, estado);
  }

  private siguienteEstado(): ActaEstado | null {
    const actual = this.acta()?.estado;
    if (!actual) return null;
    const flujo: Partial<Record<ActaEstado, ActaEstado>> = {
      BORRADOR:         'PENDIENTE_FIRMAS',
      PENDIENTE_FIRMAS: 'FIRMADA',
      FIRMADA:          'REVISADA',
      REVISADA:         'ARCHIVADA',
    };
    return flujo[actual] ?? null;
  }

  // ── Navegación ───────────────────────────────────────────────────────────
  volver(): void {
    this.router.navigate(['/app/inventario/actas']);
  }

  cargarFirma(): void {
    this.router.navigate(['cargar-firma'], { relativeTo: this.route });
  }
}
