import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  AlertComponent,
  DataTableComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';

interface MockBien {
  id: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stock: number;
  estado: string;
  fechaRegistro: string;
}

@Component({
  selector: 'restaurant-bien-delete-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    AlertComponent,
    DataTableComponent,
    LucideIconComponent,
  ],
  templateUrl: './bien-delete-page.component.html',
  styleUrl: './bien-delete-page.component.scss',
})
export class BienDeletePageComponent {
  private readonly mockBienes: MockBien[] = [
    { id: 'B001', nombre: 'Arroz blanco', categoria: 'Alimentos', unidad: 'Kilogramo', stock: 50, estado: 'Activo', fechaRegistro: '2025-01-15' },
    { id: 'B002', nombre: 'Aceite vegetal', categoria: 'Alimentos', unidad: 'Litro', stock: 20, estado: 'Activo', fechaRegistro: '2025-01-20' },
    { id: 'B003', nombre: 'Sal de mesa', categoria: 'Alimentos', unidad: 'Kilogramo', stock: 15, estado: 'Activo', fechaRegistro: '2025-02-01' },
    { id: 'B004', nombre: 'Mesa comedor 4 puestos', categoria: 'Mobiliario', unidad: 'Unidad', stock: 10, estado: 'Activo', fechaRegistro: '2024-11-10' },
    { id: 'B005', nombre: 'Silla madera', categoria: 'Mobiliario', unidad: 'Unidad', stock: 40, estado: 'Activo', fechaRegistro: '2024-11-10' },
    { id: 'B006', nombre: 'Nevera industrial', categoria: 'Equipos', unidad: 'Unidad', stock: 3, estado: 'Activo', fechaRegistro: '2024-10-05' },
    { id: 'B007', nombre: 'Estufa 6 quemadores', categoria: 'Equipos', unidad: 'Unidad', stock: 2, estado: 'Activo', fechaRegistro: '2024-10-05' },
    { id: 'B008', nombre: 'Plato hondo blanco', categoria: 'Vajilla', unidad: 'Unidad', stock: 120, estado: 'Activo', fechaRegistro: '2025-03-01' },
    { id: 'B009', nombre: 'Vaso vidrio 350ml', categoria: 'Vajilla', unidad: 'Unidad', stock: 80, estado: 'Inactivo', fechaRegistro: '2025-03-01' },
    { id: 'B010', nombre: 'Cuchillo chef', categoria: 'Utensilios', unidad: 'Unidad', stock: 15, estado: 'Activo', fechaRegistro: '2025-02-20' },
    { id: 'B011', nombre: 'Tabla picar polietileno', categoria: 'Utensilios', unidad: 'Unidad', stock: 12, estado: 'Activo', fechaRegistro: '2025-02-20' },
    { id: 'B012', nombre: 'Mantel blanco 1.5m', categoria: 'Textiles', unidad: 'Unidad', stock: 30, estado: 'Inactivo', fechaRegistro: '2024-12-01' },
    { id: 'B013', nombre: 'Servilleta tela', categoria: 'Textiles', unidad: 'Unidad', stock: 100, estado: 'Activo', fechaRegistro: '2024-12-01' },
    { id: 'B014', nombre: 'Extintor multipropósito', categoria: 'Seguridad', unidad: 'Unidad', stock: 5, estado: 'Activo', fechaRegistro: '2024-09-15' },
    { id: 'B015', nombre: 'Cafetera industrial', categoria: 'Equipos', unidad: 'Unidad', stock: 1, estado: 'Inactivo', fechaRegistro: '2024-08-20' },
  ];

  readonly busqueda = signal('');
  readonly categoriaFiltro = signal('');
  readonly estadoFiltro = signal<'todos' | 'activos' | 'inactivos'>('todos');
  readonly selectedIds = signal(new Set<string>());
  readonly selectAll = signal(false);
  readonly showConfirm = signal(false);
  readonly motivoEliminacion = signal('');
  readonly deletedCount = signal(0);
  readonly showSuccess = signal(false);

  readonly bienes = signal<MockBien[]>(this.mockBienes);

  readonly categorias = computed(() => {
    const cats = new Set(this.bienes().map(b => b.categoria));
    return Array.from(cats).sort();
  });

  readonly bienesFiltrados = computed(() => {
    const lista = this.bienes();
    const q = this.busqueda().toLowerCase();
    const cat = this.categoriaFiltro();
    const est = this.estadoFiltro();

    return lista.filter(b => {
      const matchBusqueda = !q ||
        b.nombre.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.categoria.toLowerCase().includes(q);
      const matchCategoria = !cat || b.categoria === cat;
      const matchEstado = est === 'todos' ||
        (est === 'activos' && b.estado === 'Activo') ||
        (est === 'inactivos' && b.estado === 'Inactivo');
      return matchBusqueda && matchCategoria && matchEstado;
    });
  });

  readonly algunaSeleccionado = computed(() => this.selectedIds().size > 0);
  readonly seleccionadosCount = computed(() => this.selectedIds().size);

  onToggleSelect(id: string): void {
    this.selectedIds.update(ids => {
      const next = new Set(ids);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    this.selectAll.set(this.selectedIds().size === this.bienesFiltrados().length);
  }

  onToggleSelectAll(): void {
    const allSelected = !this.selectAll();
    this.selectAll.set(allSelected);
    if (allSelected) {
      this.selectedIds.set(new Set(this.bienesFiltrados().map(b => b.id)));
    } else {
      this.selectedIds.set(new Set());
    }
  }

  onOpenConfirm(): void {
    if (this.selectedIds().size === 0) return;
    this.showConfirm.set(true);
    this.motivoEliminacion.set('');
  }

  onCancelDelete(): void {
    this.showConfirm.set(false);
    this.motivoEliminacion.set('');
  }

  onConfirmDelete(): void {
    const idsToDelete = this.selectedIds();
    const count = idsToDelete.size;

    this.bienes.update(lista => lista.filter(b => !idsToDelete.has(b.id)));
    this.selectedIds.set(new Set());
    this.selectAll.set(false);
    this.showConfirm.set(false);
    this.deletedCount.set(count);
    this.showSuccess.set(true);

    setTimeout(() => {
      this.showSuccess.set(false);
    }, 4000);
  }
}
