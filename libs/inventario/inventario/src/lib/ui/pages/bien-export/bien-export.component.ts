import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { BienExportService } from '../../../data-access/services/bien-export.service';
import { I18nService } from '../../../i18n/i18n.service';

interface FormatoExport {
  id: 'excel' | 'pdf';
  label: string;
  sub: string;
  icon: string;
  iconColor: string;
}

@Component({
  selector: 'restaurant-bien-export',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  templateUrl: './bien-export.component.html',
  styleUrl: './bien-export.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienExportPageComponent {
  private router = inject(Router);
  private bienExportService = inject(BienExportService);
  protected readonly i18n = inject(I18nService);

  selectedFormato = signal<'excel' | 'pdf'>('excel');
  soloActivos = signal(true);
  isGenerating = signal(false);

  readonly FORMATOS: FormatoExport[] = [
    { id: 'excel', label: 'Excel', sub: '.xlsx', icon: 'table_chart', iconColor: '#217346' },
    { id: 'pdf', label: 'PDF', sub: 'Documento', icon: 'picture_as_pdf', iconColor: '#d93025' },
  ];

  onSelectFormato(f: 'excel' | 'pdf'): void {
    this.selectedFormato.set(f);
  }

  onGenerar(): void {
    this.isGenerating.set(true);
    // PDF/Excel: el reporte lo genera ga-ms-reportes (server-side).
    this.bienExportService.exportToPdf(this.selectedFormato(), !this.soloActivos());
    this.isGenerating.set(false);
  }

  onVolver(): void {
    this.router.navigate(['/app/inventario/bienes']);
  }
}
