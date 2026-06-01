import {
  ChangeDetectionStrategy, Component, inject, signal, computed, OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, LucideIconComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { BienesService } from '../../../data-access/services/bienes.service';
import { RequisicionDraftService } from '../../../data-access/requisicion-draft.service';
import { Bien } from '../../../models/inventario.model';
export interface CategoriaMeta {
  key:       string;   // texto libre — coincide con el campo categoria del backend
  label:     string;
  subtitulo: string;
  icono:     string;
}

interface CatState {
  loading:   boolean;
  loaded:    boolean;
  productos: Bien[];
}

@Component({
  selector: 'restaurant-requisiciones-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonComponent, LucideIconComponent, BackButtonComponent],
  templateUrl: './requisiciones-create.component.html',
  styleUrl:    './requisiciones-create.component.scss',
})
export class RequisicionesCreateComponent implements OnInit {
  private router        = inject(Router);
  private fb            = inject(FormBuilder);
  private bienesService = inject(BienesService);
  readonly draft        = inject(RequisicionDraftService);

  // ── Categorías reales del catálogo GastroSENA ────────────────────────────
  readonly CATEGORIAS: CategoriaMeta[] = [
    { key: 'Perecederos',             label: 'Perecederos',            subtitulo: 'Carnes, lácteos y frescos',           icono: 'thermometer'  },
    { key: 'Fruver',                  label: 'Fruver',                 subtitulo: 'Frutas y verduras frescas',           icono: 'apple'        },
    { key: 'Abarrotes y Secos',       label: 'Abarrotes y Secos',      subtitulo: 'Granos, aceites, harinas y enlatados', icono: 'package'     },
    { key: 'Bebidas y Liquidos',      label: 'Bebidas y Líquidos',     subtitulo: 'Jugos, agua y bebidas',               icono: 'droplets'     },
    { key: 'Reposteria y Congelados', label: 'Repostería y Congelados', subtitulo: 'Postres, helados y congelados',      icono: 'cake'         },
  ];

  // ── Accordion state ───────────────────────────────────────────────────────
  categoriaAbierta = signal<string | null>(null);

  private readonly _catState = signal<Record<string, CatState>>({
    'Perecederos':              { loading: false, loaded: false, productos: [] },
    'Fruver':                   { loading: false, loaded: false, productos: [] },
    'Abarrotes y Secos':        { loading: false, loaded: false, productos: [] },
    'Bebidas y Liquidos':       { loading: false, loaded: false, productos: [] },
    'Reposteria y Congelados':  { loading: false, loaded: false, productos: [] },
  });
  readonly catState = computed(() => this._catState());

  // ── Context form ──────────────────────────────────────────────────────────
  contextForm = this.fb.nonNullable.group({
    fichaId:          ['', [Validators.required, Validators.pattern(/^\d{7}$/)]],
    instructorId:     ['', Validators.required],
    instructorNombre: [''],
    fecha:            [new Date().toISOString().slice(0, 10), Validators.required],
    horaSesion:       ['07:00', Validators.required],
  });

  // ── Navegación habilitada ─────────────────────────────────────────────────
  puedeRevisar = computed(() =>
    this.draft.totalItems() > 0 && this.contextForm.valid
  );

  ngOnInit(): void {
    // Pre-llenar contexto desde el draft si ya hay datos (usuario navegó hacia atrás)
    const ctx = this.draft.contexto();
    if (ctx.fichaId) {
      this.contextForm.patchValue(ctx);
    }
  }

  // ── Accordion ─────────────────────────────────────────────────────────────
  toggleCategoria(cat: string): void {
    const estaAbriendo = this.categoriaAbierta() !== cat;
    this.categoriaAbierta.set(estaAbriendo ? cat : null);

    if (estaAbriendo && !this._catState()[cat].loaded && !this._catState()[cat].loading) {
      this._catState.update(s => ({ ...s, [cat]: { ...s[cat], loading: true } }));
      this.bienesService.getBienes({ categoria: cat, estado: 'Activo', size: 50, page: 0 })
        .subscribe({
          next: ({ bienes }) =>
            this._catState.update(s => ({ ...s, [cat]: { loading: false, loaded: true, productos: bienes } })),
          error: () =>
            this._catState.update(s => ({ ...s, [cat]: { loading: false, loaded: true, productos: [] } })),
        });
    }
  }

  // ── Cantidad ──────────────────────────────────────────────────────────────
  incrementar(bien: Bien): void {
    this.draft.setCantidad(bien, this.draft.getCantidad(bien.codigoSena) + 1);
  }

  decrementar(bien: Bien): void {
    const actual = this.draft.getCantidad(bien.codigoSena);
    if (actual > 0) this.draft.setCantidad(bien, actual - 1);
  }

  onCantidadInput(bien: Bien, event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    this.draft.setCantidad(bien, isNaN(val) || val < 0 ? 0 : val);
  }

  // ── Navegación ─────────────────────────────────────────────────────────────
  revisar(): void {
    if (!this.puedeRevisar()) { this.contextForm.markAllAsTouched(); return; }
    const v = this.contextForm.getRawValue();
    this.draft.setContexto({
      fichaId:          v.fichaId,
      instructorId:     v.instructorId,
      instructorNombre: v.instructorNombre,
      fecha:            v.fecha,
      horaSesion:       v.horaSesion,
    });
    this.router.navigate(['/app/inventario/requisiciones/resumen/nueva']);
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
