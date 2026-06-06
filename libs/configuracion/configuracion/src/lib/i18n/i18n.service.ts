import { Injectable, computed, signal } from '@angular/core';
import { Idioma } from '../models/configuracion.model';
import { TRANSLATIONS } from './translations';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly _currentLang = signal<Idioma>('es');

  readonly currentLang = computed(() => this._currentLang());

  cambiarIdioma(idioma: Idioma): void {
    this._currentLang.set(idioma);
    document.documentElement.lang = idioma;
  }

  t(key: string): string {
    return TRANSLATIONS[this._currentLang()]?.[key] ?? key;
  }
}
