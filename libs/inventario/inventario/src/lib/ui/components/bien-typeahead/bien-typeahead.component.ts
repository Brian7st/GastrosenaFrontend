import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { BienesService } from '../../../data-access/services/bienes.service';
import { Bien } from '../../../models/inventario.model';

/**
 * Typeahead sobre el catálogo de bienes — replica la "virtud VLOOKUP" del Excel.
 *
 * Busca contra el diccionario de productos (equivalente a tblProductos): el operador
 * tipea código o descripción y la fila se autollena con descripción, precio adjudicado
 * y CÓD ALMACÉN (código SENA), porque el bien ya fue enriquecido desde el contrato.
 * El catálogo se carga una vez y se filtra en cliente, así el match es instantáneo.
 */
@Component({
  selector: 'restaurant-bien-typeahead',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bien-typeahead.component.html',
  styleUrl: './bien-typeahead.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienTypeaheadComponent implements OnInit {
  private bienesService = inject(BienesService);

  @Input() placeholder = 'Buscar por código o descripción…';

  /** Emite el bien elegido (trae cód almacén y precio del catálogo enriquecido). */
  @Output() seleccionar = new EventEmitter<Bien>();

  readonly query   = signal('');
  readonly abierto = signal(false);
  readonly loading = signal(false);

  private readonly catalogo = signal<Bien[]>([]);

  readonly sugerencias = computed<Bien[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];
    return this.catalogo()
      .filter(b =>
        (b.codigoSena?.toLowerCase().includes(q) ?? false) ||
        (b.descripcion?.toLowerCase().includes(q) ?? false),
      )
      .slice(0, 8);
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.bienesService.buscarCatalogo()
      .pipe(catchError(() => of([] as Bien[])))
      .subscribe(bienes => {
        this.catalogo.set(bienes);
        this.loading.set(false);
      });
  }

  onInput(value: string): void {
    this.query.set(value);
    this.abierto.set(true);
  }

  onFocus(): void {
    if (this.query().trim()) this.abierto.set(true);
  }

  /** Cierra el panel tras el click en una sugerencia (blur diferido). */
  onBlur(): void {
    setTimeout(() => this.abierto.set(false), 120);
  }

  onSeleccionar(bien: Bien): void {
    this.seleccionar.emit(bien);
    this.query.set('');
    this.abierto.set(false);
  }

  /** Enter elige la primera sugerencia (atajo tipo VLOOKUP). */
  onEnter(): void {
    const primera = this.sugerencias()[0];
    if (primera) this.onSeleccionar(primera);
  }
}
