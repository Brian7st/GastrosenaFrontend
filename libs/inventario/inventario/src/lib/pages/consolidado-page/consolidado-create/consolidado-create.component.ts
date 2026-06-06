import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  OnInit,
  effect,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent, DataTableComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { ElegibleConsolidado } from '../../../models/consolidado.model';
import { ConsolidadoFacade } from '../../../data-access/consolidado.facade';

/**
 * Local row that wraps ElegibleConsolidado with mutable selection state.
 * The `selected` field from ElegibleConsolidado is used as the selection toggle.
 */
interface SelectableRow {
  data:     ElegibleConsolidado;
  selected: boolean;
}

@Component({
  selector: 'restaurant-consolidado-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    DataTableComponent,
    StatusBadgeComponent,
    BackButtonComponent,
  ],
  templateUrl: './consolidado-create.component.html',
  styleUrl: './consolidado-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsolidadoCreateComponent implements OnInit {
  private router   = inject(Router);
  private location = inject(Location);
  private facade   = inject(ConsolidadoFacade);

  loading = this.facade.loading;
  error   = this.facade.error;

  /**
   * generadoPor field: no auth context is available inside libs/inventario.
   * The operator fills this in manually.
   * TODO: replace with injected auth user when auth integration is available here.
   */
  generadoPorCtrl = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  /** Local selection state — populated when elegibles load from the facade. */
  private _rows = signal<SelectableRow[]>([]);

  /** Public computed view of rows for the template */
  rows = computed(() => this._rows());

  constructor() {
    // Sync rows whenever facade.elegibles changes (e.g. after cargarElegibles resolves)
    effect(() => {
      const elegibles = this.facade.elegibles();
      this._rows.set(elegibles.map(e => ({ data: e, selected: false })));
    });
  }

  ngOnInit(): void {
    this.facade.cargarElegibles();
  }

  // ── Selection helpers ──────────────────────────────────────────────────────

  selectedCount = computed(() => this._rows().filter(r => r.selected).length);

  allSelected = computed(() => {
    const rows = this._rows();
    return rows.length > 0 && rows.every(r => r.selected);
  });

  subtotalNeto = computed(() =>
    this._rows().filter(r => r.selected).reduce((acc, r) => acc + r.data.monto, 0),
  );

  ivaAcumulado     = computed(() => this.subtotalNeto() * 0.19);

  retencionZeseTotal = computed(() =>
    this._rows().filter(r => r.selected).reduce((acc, r) => acc + r.data.retencionZese, 0),
  );

  totalConsolidado = computed(() =>
    this.subtotalNeto() + this.ivaAcumulado() - this.retencionZeseTotal(),
  );

  toggleSelection(row: SelectableRow): void {
    this._rows.update(rows =>
      rows.map(r => r.data.compromisoId === row.data.compromisoId
        ? { ...r, selected: !r.selected }
        : r,
      ),
    );
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this._rows.update(rows => rows.map(r => ({ ...r, selected: checked })));
  }

  goBack(): void {
    this.location.back();
  }

  confirmar(): void {
    const generadoPor = this.generadoPorCtrl.value.trim();
    if (!generadoPor) {
      this.generadoPorCtrl.markAsTouched();
      return;
    }

    const seleccionados = this._rows().filter(r => r.selected);
    if (seleccionados.length === 0) return;

    this.facade.generarConsolidado({
      lineas: seleccionados.map(r => ({
        gilId:         r.data.gilId,
        compromisoId:  r.data.compromisoId,
        facturaId:     r.data.facturaId,
        concepto:      r.data.concepto,
        fecha:         r.data.fecha,
        numeroFactura: r.data.numeroFactura,
        cufe:          r.data.cufe,
        monto:         r.data.monto,
        retencionZese: r.data.retencionZese,
      })),
      generadoPor,
    });

    this.router.navigate(['/app/inventario/consolidado']);
  }
}
