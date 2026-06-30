import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, LoadingSkeletonComponent } from '@restaurant/shared/ui';
import { Contrato, EstadoContrato } from '../../../models/contrato.model';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-contrato-detalle',
  standalone: true,
  imports: [CommonModule, ButtonComponent, LoadingSkeletonComponent],
  templateUrl: './contrato-detalle.component.html',
  styleUrl: './contrato-detalle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContratoDetalleComponent {
  protected readonly i18n = inject(I18nService);

  @Input() contrato: Contrato | undefined;
  @Input() loading = false;
  @Output() cerrar = new EventEmitter<void>();

  /** Paginación client-side de la tabla de ítems (el backend trae el contrato completo). */
  readonly pageSize = 10;
  pagina = 0;

  get totalItems(): number {
    return this.contrato?.items.length ?? 0;
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get itemsPagina() {
    const items = this.contrato?.items ?? [];
    const inicio = this.pagina * this.pageSize;
    return items.slice(inicio, inicio + this.pageSize);
  }

  get rangoDesde(): number {
    return this.totalItems === 0 ? 0 : this.pagina * this.pageSize + 1;
  }

  get rangoHasta(): number {
    return Math.min((this.pagina + 1) * this.pageSize, this.totalItems);
  }

  irAPagina(p: number): void {
    if (p >= 0 && p < this.totalPaginas) this.pagina = p;
  }

  paginaAnterior(): void {
    this.irAPagina(this.pagina - 1);
  }

  paginaSiguiente(): void {
    this.irAPagina(this.pagina + 1);
  }

  getEstadoBadgeClass(estado: EstadoContrato): string {
    return estado === 'VIGENTE' ? 'badge--vigente' : 'badge--cerrado';
  }

  formatCurrency(value: number | null): string {
    if (value === null) return '—';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatPorcentaje(value: number | null): string {
    if (value === null) return '—';
    // El IVA puede venir como fracción (0.19) o como porcentaje (19). Normalizamos:
    // si es <= 1 lo tratamos como fracción y multiplicamos; si no, ya es porcentaje.
    const pct = value <= 1 ? value * 100 : value;
    return `${pct.toFixed(0)}%`;
  }
}
