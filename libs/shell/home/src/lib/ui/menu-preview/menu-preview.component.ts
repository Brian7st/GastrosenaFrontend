import { ChangeDetectionStrategy, Component, inject, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface MenuItem {
  name: string;
  desc: string;
  price: number;
  category: string;
  img: string;
}

interface RecetaMenuDTO {
  idReceta: string;
  nombreReceta: string;
  nombreCategoria: string;
  precioUnitario: number;
  urlImagen?: string;
  temperatura?: string;
  tiempoPreparacion?: number;
  disponible?: boolean;
}

interface BarMenuDTO {
  idReceta: string;
  nombreReceta: string;
  nombreCategoria: string;
  precioUnitario: number;
  urlImagen?: string;
  temperatura?: string;
  tiempoPreparacion?: number;
}

interface CategoriaDTO {
  idCategoria: string;
  nombreCategoria: string;
}

@Component({
  selector: 'restaurant-menu-preview',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './menu-preview.component.html',
  styleUrl: './menu-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPreviewComponent implements OnInit {
  private readonly http = inject(HttpClient);

  activeTab = signal<'platos' | 'bar'>('platos');

  @Output() tabChange = new EventEmitter<'platos' | 'bar'>();

  readonly categories = [
    { key: 'platos' as const, label: 'Platos Principales' },
    { key: 'bar'    as const, label: 'Bar y Barismo'       },
  ];

  readonly platos = signal<MenuItem[]>([]);
  readonly bebidas = signal<MenuItem[]>([]);

  private categoriasCocina: string[] = [];
  private categoriasBar: string[] = [];

  ngOnInit(): void {
    forkJoin({
      recetas: this.http.get<RecetaMenuDTO[]>('/api/recetas/menu'),
      bebidas: this.http.get<BarMenuDTO[]>('/api/barybarismo/recetas/menu'),
      catsCocina: this.http.get<CategoriaDTO[]>('/api/categorias'),
      catsBar: this.http.get<CategoriaDTO[]>('/api/barybarismo/categorias'),
    }).subscribe({
      next: ({ recetas, bebidas, catsCocina, catsBar }) => {
        this.categoriasCocina = catsCocina.map(c => c.nombreCategoria.toLowerCase());
        this.categoriasBar = catsBar.map(c => c.nombreCategoria.toLowerCase());

        const disponibles = recetas.filter(r => r.disponible !== false);
        const itemsPlatos = disponibles.filter(r =>
          this.categoriasCocina.some(cat => r.nombreCategoria?.toLowerCase().includes(cat))
        );
        if (itemsPlatos.length > 0) {
          this.platos.set(
            itemsPlatos.slice(0, 12).map(r => ({
              name: r.nombreReceta,
              category: r.nombreCategoria ?? 'Especial',
              price: r.precioUnitario ?? 0,
              img: r.urlImagen ?? '',
              desc: [r.temperatura, r.tiempoPreparacion ? `${r.tiempoPreparacion} min` : null]
                .filter(Boolean).join(' · ') || (r.nombreCategoria ?? ''),
            }))
          );
        }

        const itemsBebidas = bebidas.filter(r =>
          this.categoriasBar.some(cat => r.nombreCategoria?.toLowerCase().includes(cat))
        );
        if (itemsBebidas.length > 0) {
          this.bebidas.set(
            itemsBebidas.slice(0, 12).map(r => ({
              name: r.nombreReceta,
              category: r.nombreCategoria ?? 'Bar',
              price: r.precioUnitario ?? 0,
              img: r.urlImagen ?? '',
              desc: r.temperatura ? `${r.temperatura}` : '',
            }))
          );
        }
      },
      error: () => {
        this.platos.set([]);
        this.bebidas.set([]);
      },
    });
  }

  setTab(tab: 'platos' | 'bar'): void {
    this.activeTab.set(tab);
    this.tabChange.emit(tab);
  }
}