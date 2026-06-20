import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

interface MenuItem  { name: string; desc: string; price: number; category: string; img: string; }
interface DrinkItem { name: string; desc: string; price: number; }

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

const PLATOS_FALLBACK: MenuItem[] = [
  { name: 'Filete de Salmón a la Plancha', desc: 'Con vegetales salteados, puré de papa trufa y salsa de mantequilla cítrica', price: 35000, category: 'Gourmet',  img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80' },
  { name: 'Risotto de Hongos Silvestres',  desc: 'Arroz arbóreo cremoso con mezcla de hongos, parmesano y aceite de trufa',   price: 28000, category: 'Especial', img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80' },
  { name: 'Lomo de Res a la Brasa',        desc: 'Corte premium marinado, papas rústicas y chimichurri artesanal',            price: 42000, category: 'Premium',  img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80' },
  { name: 'Pechuga Rellena de Espinaca',   desc: 'Salsa de hongos, puré de batata y ensalada verde',                         price: 26000, category: 'Clásico',  img: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80' },
];

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

  // Comienza con datos de muestra; se reemplaza con datos reales de cocina si el servicio está disponible
  readonly platos = signal<MenuItem[]>(PLATOS_FALLBACK);

  readonly cafes: DrinkItem[] = [
    { name: 'Espresso Colombiano',  desc: 'Granos premium de Huila', price: 4500 },
    { name: 'Cappuccino Artesanal', desc: 'Con arte latte',           price: 6000 },
    { name: 'Latte Macchiato',      desc: 'Con leche vaporizada',     price: 6500 },
    { name: 'Café de Filtro V60',   desc: 'Método japonés',           price: 7000 },
  ];

  readonly bebidas: DrinkItem[] = [
    { name: 'Mojito SENA',          desc: 'Con hierbabuena fresca', price: 12000 },
    { name: 'Aguapanela con Limón', desc: 'Bebida tradicional',     price:  5000 },
    { name: 'Limonada de Coco',     desc: 'Refrescante y natural',  price:  8000 },
    { name: 'Smoothie Tropical',    desc: 'Mango, piña y maracuyá', price:  9000 },
  ];

  ngOnInit(): void {
    // Carta PÚBLICA de cocina: no requiere login (en /api/recetas/menu).
    // Si cocina está caído o aún no tiene carta, catchError mantiene el fallback.
    this.http.get<RecetaMenuDTO[]>('/api/recetas/menu')
      .pipe(catchError(() => of(null)))
      .subscribe(recetas => {
        const disponibles = (recetas ?? []).filter(r => r.disponible !== false);
        if (disponibles.length > 0) {
          this.platos.set(
            disponibles.slice(0, 6).map(r => ({
              name: r.nombreReceta,
              category: r.nombreCategoria ?? 'Especial',
              price: r.precioUnitario ?? 0,
              img: r.urlImagen || PLATOS_FALLBACK[0].img,
              desc: [r.temperatura, r.tiempoPreparacion ? `${r.tiempoPreparacion} min` : null]
                .filter(Boolean).join(' · ') || (r.nombreCategoria ?? ''),
            }))
          );
        }
      });
  }

  setTab(tab: 'platos' | 'bar'): void { this.activeTab.set(tab); }
}