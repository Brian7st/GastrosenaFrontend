import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UmbralConfig } from '../../../models/alerta.model';
import { AlertasFacade } from '../../../data-access/alertas.facade';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

@Component({
  selector: 'restaurant-alertas-config',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BackButtonComponent],
  templateUrl: './alertas-config.component.html',
  styleUrl: './alertas-config.component.scss',
})
export class AlertasConfigComponent implements OnInit {
  private router = inject(Router);
  private facade = inject(AlertasFacade);

  umbrales = this.facade.umbrales;

  ngOnInit(): void {
    this.facade.cargarUmbrales();
  }

  toggleEmail(id: string): void {
    const updated = this.umbrales().map(u =>
      u.id === id ? { ...u, emailActivo: !u.emailActivo } : u
    );
    this.facade.guardarUmbrales(updated);
  }

  updateStockMinimo(id: string, event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    const updated = this.umbrales().map(u =>
      u.id === id ? { ...u, stockMinimo: value } : u
    );
    this.facade.guardarUmbrales(updated);
  }

  updateCorreos(id: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const updated = this.umbrales().map(u =>
      u.id === id ? { ...u, correos: value } : u
    );
    this.facade.guardarUmbrales(updated);
  }

  guardarConfig(): void {
    this.facade.guardarUmbrales(this.umbrales());
  }

  restablecerValores(): void {
    this.facade.cargarUmbrales();
  }

  volver(): void {
    this.router.navigate(['/app/inventario/alertas']);
  }
}
