import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FeaturedItem, HeroContent, ContactInfo } from '../models/home.models';

// TODO: replace with real HTTP data-access via BaseHttpService
@Injectable({ providedIn: 'root' })
export class HomeService {

  getHeroContent(): Observable<HeroContent> {
    return of({
      title: 'Bienvenido a GastroSENA',
      subtitle: 'Explora la excelencia culinaria del programa de gastronomía SENA Quindío. Recetas auténticas, platos gourmet y experiencias únicas.',
      primaryActionLabel: 'Ver Menú',
      secondaryActionLabel: 'Conocer más',
    });
  }

  getMenuItems(): Observable<FeaturedItem[]> {
    return of([
      { id: 'm1', title: 'Menú del Día',      description: 'Sopa, plato principal, jugo y postre.',         price: 12000, category: 'menu', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
      { id: 'm2', title: 'Menú Ejecutivo',    description: 'Entrada, plato fuerte y bebida.',                price: 18000, category: 'menu', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' },
      { id: 'm3', title: 'Menú Especial',     description: 'Experiencia gourmet de tres tiempos.',           price: 35000, category: 'menu', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' },
    ]);
  }

  getRecipes(): Observable<FeaturedItem[]> {
    return of([
      { id: 'r1', title: 'Bandeja Paisa',      description: 'Plato típico colombiano con frijoles, arroz, chicharrón, huevo y más.',    category: 'recetas', imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400' },
      { id: 'r2', title: 'Ajiaco Bogotano',    description: 'Sopa tradicional con papas criollas, pollo y guascas.',                    category: 'recetas', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
      { id: 'r3', title: 'Sancocho de Gallina',description: 'Contundente sopa de gallina criolla con verduras.',                        category: 'recetas', imageUrl: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400' },
      { id: 'r4', title: 'Lechona Tolimense',  description: 'Cerdo relleno horneado lentamente, especialidad del Tolima.',              category: 'recetas', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },
    ]);
  }

  getMainDishes(): Observable<FeaturedItem[]> {
    return of([
      { id: 'md1', title: 'Filete de Res al Carbón',  description: 'Corte premium acompañado de papas rústicas y ensalada.',          price: 28000, category: 'platos-principales', imageUrl: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=400' },
      { id: 'md2', title: 'Pollo a la Plancha',        description: 'Pechuga marinada con hierbas frescas y vegetales salteados.',     price: 22000, category: 'platos-principales', imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400' },
      { id: 'md3', title: 'Trucha a la Mantequilla',   description: 'Trucha del Quindío con mantequilla de ajo y limón.',              price: 25000, category: 'platos-principales', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400' },
      { id: 'md4', title: 'Pasta al Pesto',             description: 'Linguini con pesto de albahaca fresca y queso parmesano.',       price: 19000, category: 'platos-principales', imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400' },
    ]);
  }

  getDesserts(): Observable<FeaturedItem[]> {
    return of([
      { id: 'd1', title: 'Tres Leches',       description: 'Esponjoso pastel bañado en tres tipos de leche.',           price: 8000, category: 'postres', imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400' },
      { id: 'd2', title: 'Crème Brûlée',      description: 'Crema francesa con costra de azúcar caramelizada.',          price: 9000, category: 'postres', imageUrl: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400' },
      { id: 'd3', title: 'Torta de Guanábana',description: 'Pastel artesanal de guanábana con crema chantilly.',          price: 7500, category: 'postres', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
    ]);
  }

  getGastronomyItems(): Observable<FeaturedItem[]> {
    return of([
      { id: 'g1', title: 'Cocina Fusión',        description: 'Técnicas modernas aplicadas a ingredientes colombianos.',      category: 'gastronomia', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400' },
      { id: 'g2', title: 'Cocina de Autor',      description: 'Creaciones originales de nuestros aprendices avanzados.',     category: 'gastronomia', imageUrl: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400' },
      { id: 'g3', title: 'Gastronomía Regional', description: 'Sabores auténticos del Eje Cafetero y el Quindío.',           category: 'gastronomia', imageUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3df1?w=400' },
    ]);
  }

  getBarItems(): Observable<FeaturedItem[]> {
    return of([
      { id: 'b1', title: 'Cóctel de Maracuyá',  description: 'Refrescante combinación de maracuyá, vodka y menta fresca.',  price: 14000, category: 'bar', imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400' },
      { id: 'b2', title: 'Mojito Tropical',      description: 'Ron blanco, limón, hierbabuena y soda con toque de coco.',   price: 15000, category: 'bar', imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400' },
      { id: 'b3', title: 'Sangría Colombiana',   description: 'Vino tinto con frutas tropicales de temporada.',             price: 13000, category: 'bar', imageUrl: 'https://images.unsplash.com/photo-1562599838-8cc458014da8?w=400' },
    ]);
  }

  getBarismoItems(): Observable<FeaturedItem[]> {
    return of([
      { id: 'ba1', title: 'Espresso Quindío',      description: 'Shot concentrado de café de origen del Quindío, notas cítricas.',    price: 4000, category: 'barismo', imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400' },
      { id: 'ba2', title: 'Latte de Panela',        description: 'Espresso con leche vaporizada endulzada con panela artesanal.',      price: 7000, category: 'barismo', imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400' },
      { id: 'ba3', title: 'Cold Brew Colombiano',   description: 'Infusión en frío de 18 horas con café especial de Armenia.',        price: 8000, category: 'barismo', imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
      { id: 'ba4', title: 'Capuchino Artesanal',    description: 'Espresso doble con leche texturizada y arte latte.',                price: 8500, category: 'barismo', imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
    ]);
  }

  getContactInfo(): Observable<ContactInfo> {
    return of({
      address:  'Centro de Comercio y Turismo SENA, Armenia, Quindío',
      phone:    '+57 (606) 741 0000',
      email:    'gastronomia.quindio@sena.edu.co',
      schedule: 'Lunes a Viernes: 7:00 am – 5:00 pm',
    });
  }
}
