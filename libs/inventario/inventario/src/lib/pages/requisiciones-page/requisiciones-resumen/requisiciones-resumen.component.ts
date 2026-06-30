import {
  ChangeDetectionStrategy, Component, computed, inject, signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { RequisicionDraftService, ItemDraft } from '../../../data-access/requisicion-draft.service';
import { RequisicionesService } from '../../../data-access/services/requisiciones.service';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-requisiciones-resumen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideIconComponent, DecimalPipe],
  templateUrl: './requisiciones-resumen.component.html',
  styleUrl:    './requisiciones-resumen.component.scss',
})
export class RequisicionesResumenComponent {
  private router  = inject(Router);
  protected readonly i18n = inject(I18nService);
  private service = inject(RequisicionesService);
  readonly draft  = inject(RequisicionDraftService);

  readonly enviando = signal(false);
  readonly error    = signal<string | null>(null);

  /** Etiquetas para las categorías reales del catálogo.
   *  Clave = valor de bien.categoria del backend. */
  readonly LABELS: Record<string, string> = {
    'Perecederos':              'Perecederos',
    'Fruver':                   'Fruver',
    'Abarrotes y Secos':        'Abarrotes y Secos',
    'Bebidas y Liquidos':       'Bebidas y Líquidos',
    'Reposteria y Congelados':  'Repostería y Congelados',
  };

  /** Items agrupados por categoría para la vista */
  readonly itemsPorCategoria = computed(() => {
    const grupos = new Map<string, ItemDraft[]>();
    for (const item of this.draft.itemsConCantidad()) {
      const cat = item.bien.categoria ?? 'ABARROTES';
      if (!grupos.has(cat)) grupos.set(cat, []);
      grupos.get(cat)!.push(item);
    }
    return Array.from(grupos.entries()).map(([cat, items]) => ({
      cat,
      label: this.LABELS[cat] ?? cat,
      items,
    }));
  });

  confirmar(): void {
    if (this.draft.totalItems() === 0 || this.enviando()) return;
    const ctx = this.draft.contexto();
    const items = this.draft.buildItems();

    this.enviando.set(true);
    this.error.set(null);

    this.service.crearRequisicion({
      fichaId:          ctx.fichaId,
      instructorId:     ctx.instructorId,
      instructorNombre: ctx.instructorNombre,
      fecha:            ctx.fecha,
      horaSesion:       ctx.horaSesion,
      items,
    }).subscribe({
      next: () => {
        this.draft.limpiar();
        this.router.navigate(['/app/inventario/requisiciones']);
      },
      error: (err) => {
        this.enviando.set(false);
        const detalle = err?.error?.detail ?? err?.message ?? '';
        this.error.set(detalle || 'Error al crear la requisición. Verificá los datos e intentá nuevamente.');
        console.error('[RequisicionResumen] Error:', err);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/app/inventario/requisiciones/nueva']);
  }

  close(): void {
    this.volver();
  }
}
