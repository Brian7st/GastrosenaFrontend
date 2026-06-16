import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent, ButtonComponent, KpiCardComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { TomaFisicaItem, ConteoItemData } from '../../../models/conciliacion.model';
import { ConciliacionFacade } from '../../../data-access/conciliacion.facade';

type TabActivo = 'todos' | 'diferencias' | 'pendientes';

@Component({
  selector: 'restaurant-conciliacion-toma-fisica',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucideIconComponent,
    ButtonComponent,
    KpiCardComponent,
    BackButtonComponent,
  ],
  templateUrl: './conciliacion-toma-fisica.component.html',
  styleUrl: './conciliacion-toma-fisica.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionTomaFisicaComponent implements OnInit {
  private router   = inject(Router);
  private route    = inject(ActivatedRoute);
  private location = inject(Location);
  private facade   = inject(ConciliacionFacade);

  constructor() {
    // El facade es singleton: limpiar cualquier id de una conciliación previa
    // ANTES de que corra navEffect, para no redirigir al entrar a esta pantalla.
    this.facade.limpiarUltimaConciliacion();
  }

  fecha       = signal(new Date().toISOString().slice(0, 10));
  responsable = signal('Instructor');
  activeTab   = signal<TabActivo>('todos');

  // Categoría seleccionada desde el dashboard (toma física por categoría).
  // Si está vacía, se cuenta todo el catálogo.
  categoria   = signal<string>('');

  items = signal<TomaFisicaItem[]>([]);

  loading = computed(() => this.facade.loading());
  error   = computed(() => this.facade.error());

  // Los effect() se crean en el inicializador de campo (contexto de inyección).
  // Crearlos en ngOnInit lanzaría NG0203 y la siembra de datos nunca correría.
  private readonly seedEffect = effect(() => {
    const loaded = this.facade.tomaFisicaItems();
    if (loaded.length > 0 && this.items().length === 0) {
      this.items.set([...loaded]);
    }
  }, { allowSignalWrites: true });

  // Navega al detalle cuando el backend confirma la conciliación creada.
  // Navegación relativa: desde 'conciliacion/toma-fisica' → '../:id'.
  private readonly navEffect = effect(() => {
    const id = this.facade.ultimaConciliacionId();
    if (id) {
      this.router.navigate(['../', id], { relativeTo: this.route });
    }
  });

  ngOnInit(): void {
    const cat = this.route.snapshot.queryParamMap.get('categoria') ?? '';
    this.categoria.set(cat);
    this.facade.cargarTomaFisicaItems(cat);
  }

  // ─── Computed stats ───────────────────────────────────────────────
  itemsTotales    = computed(() => this.items().length);
  pendientesCount = computed(() => this.items().filter(i => i.conteoFisico === null).length);
  itemsContados   = computed(() => this.items().filter(i => i.conteoFisico !== null).length);

  diferenciasCount = computed(() =>
    this.items().filter(i => i.conteoFisico !== null && i.conteoFisico !== i.stockSistema).length
  );

  precision = computed(() => {
    if (this.itemsContados() === 0) return 100;
    const exactos = this.itemsContados() - this.diferenciasCount();
    return Math.round((exactos / this.itemsContados()) * 100);
  });

  impactoFinanciero = computed(() =>
    this.items().reduce((acc, item) => {
      if (item.conteoFisico === null) return acc;
      return acc + (item.conteoFisico - item.stockSistema) * item.valorUnitario;
    }, 0)
  );

  filteredItems = computed(() => {
    const tab = this.activeTab();
    return this.items().filter(item => {
      if (tab === 'pendientes') return item.conteoFisico === null;
      if (tab === 'diferencias') return item.conteoFisico !== null && item.conteoFisico !== item.stockSistema;
      return true;
    });
  });

  // ─── Actions ─────────────────────────────────────────────────────
  goBack(): void {
    this.location.back();
  }

  setTab(tab: TabActivo): void {
    this.activeTab.set(tab);
  }

  updateConteoFisico(id: string, value: number | null): void {
    this.items.update(items =>
      items.map(item => item.id === id ? { ...item, conteoFisico: value } : item)
    );
  }

  puedeFinalizar = computed(() =>
    !this.loading() && this.itemsContados() > 0 && this.responsable().trim().length > 0
  );

  finalizar(): void {
    if (!this.puedeFinalizar()) return;

    const conteoItems: ConteoItemData[] = this.items()
      .filter(i => i.conteoFisico !== null)
      .map(i => ({
        codigoSena:      i.codigoSena,
        descripcion:     i.producto,
        cantidadSistema: i.stockSistema,
        cantidadFisica:  i.conteoFisico as number,
        valorUnitario:   i.valorUnitario,
      }));

    this.facade.finalizarTomaFisica(
      {
        responsableId:     this.responsable(),
        responsableNombre: this.responsable(),
        tipo:              'FISICA',
        fecha:             this.fecha(),
      },
      conteoItems
    );
  }

  // ─── Helpers UI ──────────────────────────────────────────────────
  getDiferencia(item: TomaFisicaItem): number | null {
    if (item.conteoFisico === null) return null;
    return item.conteoFisico - item.stockSistema;
  }

  getImpactoTotal(item: TomaFisicaItem): number | null {
    const dif = this.getDiferencia(item);
    if (dif === null) return null;
    return dif * item.valorUnitario;
  }

  formatCurrency(value: number | null): string {
    if (value === null) return '-';
    if (value === 0) return '$0';
    const signo    = value < 0 ? '-' : '+';
    const formatted = new Intl.NumberFormat('es-CO').format(Math.abs(value));
    return `${signo}$${formatted}`;
  }
}
