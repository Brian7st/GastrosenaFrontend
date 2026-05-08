import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UmbralConfig, MOCK_UMBRALES } from '../../../models/alerta.model';

@Component({
  selector: 'restaurant-alertas-config',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './alertas-config.component.html',
  styleUrls: ['./alertas-config.component.scss'],
})
export class AlertasConfigComponent {
  private router = inject(Router);

  umbrales = signal<UmbralConfig[]>(MOCK_UMBRALES);

  toggleEmail(id: string): void {
    this.umbrales.update(list =>
      list.map(u =>
        u.id === id ? { ...u, emailActivo: !u.emailActivo } : u
      )
    );
  }

  updateStockMinimo(id: string, event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.umbrales.update(list =>
      list.map(u => u.id === id ? { ...u, stockMinimo: value } : u)
    );
  }

  updateCorreos(id: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.umbrales.update(list =>
      list.map(u => u.id === id ? { ...u, correos: value } : u)
    );
  }

  guardarConfig(): void {
    console.log('Guardando configuración de umbrales:', this.umbrales());
  }

  restablecerValores(): void {
    this.umbrales.set(MOCK_UMBRALES.map(u => ({ ...u })));
  }

  volver(): void {
    this.router.navigate(['/app/inventario/alertas']);
  }
}
