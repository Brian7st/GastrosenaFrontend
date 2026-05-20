import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

@Component({
  selector: 'restaurant-requisiciones-create',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent, BackButtonComponent],
  templateUrl: './requisiciones-create.component.html',
  styleUrl: './requisiciones-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesCreateComponent {
  private router = inject(Router);

  categoriaAbierta = signal<string | null>(null);

  toggleCategory(name: string): void {
    this.categoriaAbierta.update(current => current === name ? null : name);
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
