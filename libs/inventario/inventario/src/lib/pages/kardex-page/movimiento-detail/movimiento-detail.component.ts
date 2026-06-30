import { Component, inject, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { ExportarComponent } from '../../../components/exportar/exportar.component';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-movimiento-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent, ButtonComponent, BackButtonComponent, ExportarComponent],
  templateUrl: './movimiento-detail.component.html',
  styleUrl: './movimiento-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovimientoDetailComponent implements OnInit {
  private router = inject(Router);
  protected readonly i18n = inject(I18nService);
  private route  = inject(ActivatedRoute);
  private facade = inject(KardexFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  documento  = this.facade.documentoSeleccionado;
  bienes     = this.facade.bienesDocumento;
  loading    = this.facade.loading;

  getTipoLabel(tipo: string | undefined): string {
    const map: Record<string, string> = {
      ENTRADA: 'Entrada', SALIDA: 'Salida',
    };
    return tipo ? (map[tipo] ?? tipo) : '';
  }

  getVariant(estado: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (estado) {
      case 'Completado': return 'success';
      case 'Pendiente':  return 'warning';
      case 'Cancelado':  return 'danger';
      default:           return 'info';
    }
  }

  // ── Modal de exportación ──────────────────────────────────────────────────
  showExportModal = signal(false);

  ngOnInit(): void {
    const id   = this.route.snapshot.paramMap.get('id');
    const tipo = this.route.snapshot.queryParamMap.get('tipo') as 'ENTRADA' | 'SALIDA' | null;

    if (!id || (tipo !== 'ENTRADA' && tipo !== 'SALIDA')) {
      this.router.navigate(['/app/inventario/movimientos']);
      return;
    }

    this.facade.cargarDocumento(id, tipo);
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/movimientos']);
  }

  openExportModal(): void {
    this.showExportModal.set(true);
  }

  closeExportModal(): void {
    this.showExportModal.set(false);
  }

  onExport(formato: string): void {
    console.log('Exportar documento:', formato);
    this.closeExportModal();
  }
}
