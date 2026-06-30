import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface MenuItem  { name: string; desc: string; price: number; category: string; img: string; }

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

  readonly categories = [
    { key: 'platos' as const, label: 'Platos Principales' },
    { key: 'bar'    as const, label: 'Bar y Barismo'       },
  ];

  readonly platos = signal<MenuItem[]>([]);
  readonly bebidas = signal<MenuItem[]>([]);

  ngOnInit(): void {
    this.http.get<RecetaMenuDTO[]>('/api/recetas/menu')
      .subscribe({
        next: recetas => {
          const disponibles = recetas.filter(r => r.disponible !== false);
          if (disponibles.length > 0) {
            this.platos.set(
              disponibles.slice(0, 12).map(r => ({
                name: r.nombreReceta,
                category: r.nombreCategoria ?? 'Especial',
                price: r.precioUnitario ?? 0,
                img: r.urlImagen ?? '',
                desc: [r.temperatura, r.tiempoPreparacion ? `${r.tiempoPreparacion} min` : null]
                  .filter(Boolean).join(' · ') || (r.nombreCategoria ?? ''),
              }))
            );
          }
        },
        error: () => this.platos.set([]),
      });

    this.http.get<BarMenuDTO[]>('/api/barybarismo/recetas/menu')
      .subscribe({
        next: items => {
          if (items.length > 0) {
            this.bebidas.set(
              items.slice(0, 12).map(r => ({
                name: r.nombreReceta,
                category: r.nombreCategoria ?? 'Bar',
                price: r.precioUnitario ?? 0,
                img: r.urlImagen ?? '',
                desc: r.temperatura ? `${r.temperatura}` : '',
              }))
            );
          }
        },
        error: () => this.bebidas.set([]),
      });
  }

  setTab(tab: 'platos' | 'bar'): void { this.activeTab.set(tab); }
}