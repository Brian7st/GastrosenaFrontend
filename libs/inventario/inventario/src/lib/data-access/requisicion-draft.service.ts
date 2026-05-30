import { Injectable, signal, computed } from '@angular/core';
import { Bien } from '../models/inventario.model';
import { CategoriaInsumo, RequisicionItem } from '../models/requisicion.model';

export interface RequisicionDraftContexto {
  fichaId:          string;
  instructorId:     string;
  instructorNombre: string;
  fecha:            string;   // ISO date "yyyy-MM-dd"
  horaSesion:       string;   // "HH:mm"
}

export interface ItemDraft {
  cantidad: number;
  bien:     Bien;
}

@Injectable({ providedIn: 'root' })
export class RequisicionDraftService {

  readonly contexto = signal<RequisicionDraftContexto>({
    fichaId: '', instructorId: '', instructorNombre: '', fecha: '', horaSesion: '',
  });

  /** { [codigoSena]: { cantidad, bien } } — solo los que tienen cantidad > 0 */
  readonly seleccionados = signal<Record<string, ItemDraft>>({});

  /** Items con cantidad > 0 */
  readonly itemsConCantidad = computed(() =>
    Object.values(this.seleccionados()).filter(v => v.cantidad > 0)
  );

  readonly totalItems = computed(() => this.itemsConCantidad().length);

  readonly totalUnidades = computed(() =>
    this.itemsConCantidad().reduce((sum, v) => sum + v.cantidad, 0)
  );

  setContexto(ctx: RequisicionDraftContexto): void {
    this.contexto.set(ctx);
  }

  getCantidad(codigoSena: string): number {
    return this.seleccionados()[codigoSena]?.cantidad ?? 0;
  }

  setCantidad(bien: Bien, cantidad: number): void {
    this.seleccionados.update(sel => {
      const next = { ...sel };
      if (cantidad <= 0) {
        delete next[bien.codigoSena];
      } else {
        next[bien.codigoSena] = { cantidad, bien };
      }
      return next;
    });
  }

  limpiar(): void {
    this.seleccionados.set({});
    this.contexto.set({ fichaId: '', instructorId: '', instructorNombre: '', fecha: '', horaSesion: '' });
  }

  /** Construye el array de RequisicionItem listo para el backend.
   *  Mapea las categorías libres del catálogo al enum CategoriaInsumo
   *  que requiere el módulo de legalización. */
  buildItems(): RequisicionItem[] {
    return this.itemsConCantidad().map(({ cantidad, bien }) => ({
      productoId:     bien.codigoSena,
      productoNombre: bien.nombre,
      cantidad,
      unidadMedida:   bien.unidadMedida,
      categoria:      RequisicionDraftService.mapearCategoria(bien.categoria ?? ''),
    }));
  }

  /** Mapea el texto libre de categoría del catálogo al enum CategoriaInsumo
   *  requerido por el backend de legalización (ItemRequisicion). */
  static mapearCategoria(cat: string): CategoriaInsumo {
    const c = cat.toLowerCase();
    if (c.includes('fruver') || c.includes('fruta') || c.includes('vegetal') || c.includes('verdura'))
      return 'FRUTAS_Y_VEGETALES';
    if (c.includes('perecedero') || c.includes('carne') || c.includes('pescado') || c.includes('marisco'))
      return 'CARNES_PESCADOS_MARISCOS';
    if (c.includes('lácteo') || c.includes('lacteo') || c.includes('leche') || c.includes('queso'))
      return 'LACTEOS';
    // abarrotes y secos, bebidas y líquidos, repostería y congelados → ABARROTES
    return 'ABARROTES';
  }
}
