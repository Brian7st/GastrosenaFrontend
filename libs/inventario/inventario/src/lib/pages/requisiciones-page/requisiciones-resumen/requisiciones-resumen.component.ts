import {
  ChangeDetectionStrategy, Component, computed, inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { RequisicionDraftService, ItemDraft } from '../../../data-access/requisicion-draft.service';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';

@Component({
  selector: 'restaurant-requisiciones-resumen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideIconComponent, DecimalPipe],
  templateUrl: './requisiciones-resumen.component.html',
  styleUrl:    './requisiciones-resumen.component.scss',
})
export class RequisicionesResumenComponent {
  private router = inject(Router);
  private facade = inject(RequisicionesFacade);
  readonly draft = inject(RequisicionDraftService);

  readonly loading = this.facade.loading;

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
    if (this.draft.totalItems() === 0) return;
    const ctx = this.draft.contexto();
    const items = this.draft.buildItems();

    this.facade.crearRequisicion({
      fichaId:          ctx.fichaId,
      instructorId:     ctx.instructorId,
      instructorNombre: ctx.instructorNombre,
      fecha:            ctx.fecha,
      horaSesion:       ctx.horaSesion,
      items,
    });

    this.draft.limpiar();
    this.router.navigate(['/app/inventario/requisiciones']);
  }

  volver(): void {
    this.router.navigate(['/app/inventario/requisiciones/nueva']);
  }

  close(): void {
    this.volver();
  }
}
