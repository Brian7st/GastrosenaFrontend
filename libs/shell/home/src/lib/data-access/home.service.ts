import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FeaturedItem, HeroContent, ContactInfo } from '../models/home.models';

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

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly http = inject(HttpClient);

  getHeroContent(): Observable<HeroContent> {
    return of({
      title: 'Bienvenido a GastroSENA',
      subtitle: 'Explora la excelencia culinaria del programa de gastronomía SENA Quindío. Recetas auténticas, platos gourmet y experiencias únicas.',
      primaryActionLabel: 'Ver Menú',
      secondaryActionLabel: 'Conocer más',
    });
  }

  getMenuItems(): Observable<FeaturedItem[]> {
    return this.http.get<RecetaMenuDTO[]>('/api/recetas/menu')
      .pipe(
        map(recetas => recetas
          .filter(r => r.disponible !== false)
          .map(r => ({
            id: r.idReceta,
            title: r.nombreReceta,
            description: r.nombreCategoria,
            imageUrl: r.urlImagen,
            price: r.precioUnitario,
            category: r.nombreCategoria,
          }))
        ),
        catchError(() => of([])),
      );
  }

  getRecipes(): Observable<FeaturedItem[]> {
    return this.http.get<RecetaMenuDTO[]>('/api/recetas/menu')
      .pipe(
        map(recetas => recetas
          .filter(r => r.disponible !== false && r.nombreCategoria?.toLowerCase().includes('tradicional'))
          .map(r => ({
            id: r.idReceta,
            title: r.nombreReceta,
            description: r.nombreCategoria,
            imageUrl: r.urlImagen,
            category: r.nombreCategoria,
          }))
        ),
        catchError(() => of([])),
      );
  }

  getMainDishes(): Observable<FeaturedItem[]> {
    return this.http.get<RecetaMenuDTO[]>('/api/recetas/menu')
      .pipe(
        map(recetas => recetas
          .filter(r => r.disponible !== false && r.precioUnitario > 0)
          .slice(0, 6)
          .map(r => ({
            id: r.idReceta,
            title: r.nombreReceta,
            description: [r.nombreCategoria, r.tiempoPreparacion ? `${r.tiempoPreparacion} min` : null]
              .filter(Boolean).join(' · '),
            imageUrl: r.urlImagen,
            price: r.precioUnitario,
            category: r.nombreCategoria,
          }))
        ),
        catchError(() => of([])),
      );
  }

  getDesserts(): Observable<FeaturedItem[]> {
    return this.http.get<RecetaMenuDTO[]>('/api/recetas/menu')
      .pipe(
        map(recetas => recetas
          .filter(r => r.disponible !== false && r.nombreCategoria?.toLowerCase().includes('postre'))
          .map(r => ({
            id: r.idReceta,
            title: r.nombreReceta,
            description: r.nombreCategoria,
            imageUrl: r.urlImagen,
            price: r.precioUnitario,
            category: r.nombreCategoria,
          }))
        ),
        catchError(() => of([])),
      );
  }

  getGastronomyItems(): Observable<FeaturedItem[]> {
    return this.http.get<RecetaMenuDTO[]>('/api/recetas/menu')
      .pipe(
        map(recetas => recetas
          .filter(r => r.disponible !== false && r.nombreCategoria?.toLowerCase().includes('gourmet'))
          .map(r => ({
            id: r.idReceta,
            title: r.nombreReceta,
            description: r.nombreCategoria,
            imageUrl: r.urlImagen,
            category: r.nombreCategoria,
          }))
        ),
        catchError(() => of([])),
      );
  }

  getBarItems(): Observable<FeaturedItem[]> {
    return this.http.get<BarMenuDTO[]>('/api/barybarismo/recetas/menu')
      .pipe(
        map(items => items.map(r => ({
          id: r.idReceta,
          title: r.nombreReceta,
          description: r.nombreCategoria,
          imageUrl: r.urlImagen,
          price: r.precioUnitario,
          category: r.nombreCategoria,
        }))),
        catchError(() => of([])),
      );
  }

  getBarismoItems(): Observable<FeaturedItem[]> {
    return this.http.get<BarMenuDTO[]>('/api/barybarismo/recetas/menu')
      .pipe(
        map(items => items.map(r => ({
          id: r.idReceta,
          title: r.nombreReceta,
          description: r.nombreCategoria,
          imageUrl: r.urlImagen,
          price: r.precioUnitario,
          category: r.nombreCategoria,
        }))),
        catchError(() => of([])),
      );
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
