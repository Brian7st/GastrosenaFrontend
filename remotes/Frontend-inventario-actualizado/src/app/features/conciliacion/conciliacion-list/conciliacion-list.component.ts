import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { ConsolidadoResumen, MOCK_CONSOLIDADOS } from '../models/consolidado.model';

@Component({
    selector: 'app-conciliacion-list',
    imports: [CommonModule, RouterModule, LucideIconComponent],
    templateUrl: './conciliacion-list.component.html',
    styleUrls: ['./conciliacion-list.component.scss']
})
export class ConciliacionListComponent {
  consolidados = signal<ConsolidadoResumen[]>(MOCK_CONSOLIDADOS);
  currentPage = signal(1);

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-CO');
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }
}
