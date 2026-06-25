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
    return of([]);
  }

  getRecipes(): Observable<FeaturedItem[]> {
    return of([]);
  }

  getMainDishes(): Observable<FeaturedItem[]> {
    return of([]);
  }

  getDesserts(): Observable<FeaturedItem[]> {
    return of([]);
  }

  getGastronomyItems(): Observable<FeaturedItem[]> {
    return of([]);
  }

  getBarItems(): Observable<FeaturedItem[]> {
    return of([]);
  }

  getBarismoItems(): Observable<FeaturedItem[]> {
    return of([]);
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
