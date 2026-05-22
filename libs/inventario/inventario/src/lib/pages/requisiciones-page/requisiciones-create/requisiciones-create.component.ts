import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent, LucideIconComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

@Component({
  selector: 'restaurant-requisiciones-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, LucideIconComponent, BackButtonComponent],
  templateUrl: './requisiciones-create.component.html',
  styleUrl: './requisiciones-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesCreateComponent {
  private router = inject(Router);

  categoriaAbierta = signal<string | null>(null);

  cantidades = signal<Record<string, number>>({
    aceite: 5,
    arroz:  12,
    sal:    3,
  });

  toggleCategory(name: string): void {
    this.categoriaAbierta.update(current => current === name ? null : name);
  }

  incrementar(key: string): void {
    this.cantidades.update(c => ({ ...c, [key]: (c[key] ?? 1) + 1 }));
  }

  decrementar(key: string): void {
    this.cantidades.update(c => ({ ...c, [key]: Math.max(1, (c[key] ?? 1) - 1) }));
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
