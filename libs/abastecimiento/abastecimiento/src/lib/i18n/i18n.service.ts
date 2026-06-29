import { Injectable, computed, signal, DestroyRef, inject } from '@angular/core';
import { TRANSLATIONS } from './translations';

type Idioma = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly _currentLang = signal<Idioma>(
    (localStorage.getItem('gastrosena-idioma') as Idioma) ?? 'es',
  );

  readonly currentLang = computed(() => this._currentLang());

  private observer: MutationObserver | null = null;

  constructor() {
    this.observer = new MutationObserver(() => {
      const lang = document.documentElement.lang as Idioma;
      if (lang && lang !== this._currentLang()) {
        this._currentLang.set(lang);
      }
    });
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });

    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  t(key: string): string {
    return TRANSLATIONS[this._currentLang()]?.[key] ?? key;
  }
}
