import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from './api-config.token';

@Injectable({ providedIn: 'root' })
export class BaseHttpService {
  protected readonly http = inject(HttpClient);
  protected readonly apiBaseUrl = inject(API_BASE_URL);

  protected buildUrl(resource: string): string {
    return `${this.apiBaseUrl}/${resource}`;
  }
}
