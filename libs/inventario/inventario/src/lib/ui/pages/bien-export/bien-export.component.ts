import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BienExportConfig } from '../../../models/inventario.model';
import { CATEGORIAS_BIEN } from '../../../models/categorias.model';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { BienExportService } from '../../../data-access/services/bien-export.service';
import { InventarioFacade } from '../../../data-access/inventario.facade';

interface FormatoExport {
  id: 'excel' | 'pdf' | 'csv';
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
  private facade = inject(InventarioFacade);

  selectedFormato = signal<'excel' | 'pdf' | 'csv'>('excel');
  soloActivos = signal(true);
  soloBajoStock = signal(false);
  fechaInicio = signal('');
  fechaFin = signal('');
  categoria = signal('');
  almacen = signal('');
  isGenerating = signal(false);

  readonly FORMATOS: FormatoExport[] = [
    { id: 'excel', label: 'Excel', sub: '.xlsx', icon: 'table_chart', iconColor: '#217346' },
    { id: 'pdf', label: 'PDF', sub: 'Documento', icon: 'picture_as_pdf', iconColor: '#d93025' },
    { id: 'csv', label: 'CSV', sub: 'Texto plano', icon: 'csv', iconColor: '#475569' },
  ];

  readonly CATEGORIAS = ['Todas las categorías', ...CATEGORIAS_BIEN];
  readonly ALMACENES = ['Todos los almacenes', 'Almacén Central', 'Sede Norte', 'Sede Sur', 'Laboratorio 302'];

  readonly EXPORTACIONES_RECIENTES = [
    { nombre: 'Inv_Bienes_Oct.xlsx', tiempo: 'Hace 2 horas', tamano: '4.2 MB', icono: 'table_chart', color: '#217346' },
    { nombre: 'Reporte_BajoStock.pdf', tiempo: 'Ayer', tamano: '1.8 MB', icono: 'picture_as_pdf', color: '#d93025' },
  ];

  readonly resumenReporte = computed(() => ({
    registros: 1248,
    valorEstimado: 142500.00,
    columnas: 24,
    listaPreciosIncluida: true,
    existenciasIncluidas: true,
  }));

  onSelectFormato(f: 'excel' | 'pdf' | 'csv'): void {
    this.selectedFormato.set(f);
  }

  onGenerar(): void {
    this.isGenerating.set(true);
    const config: BienExportConfig = {
      formato: this.selectedFormato(),
      soloActivos: this.soloActivos(),
      soloBajoStock: this.soloBajoStock(),
      categoria: this.categoria() || undefined,
      almacen: this.almacen() || undefined,
      rangoFechas: this.fechaInicio() && this.fechaFin()
        ? { inicio: this.fechaInicio(), fin: this.fechaFin() }
        : undefined,
    };

    const bienesParaExportar = this.facade.bienes();

    if (config.formato === 'csv') {
      this.bienExportService.exportToCsv(bienesParaExportar);
    } else {
      this.bienExportService.exportToPdf(bienesParaExportar);
    }

    this.isGenerating.set(false);
  }

  onVolver(): void {
    this.router.navigate(['/app/inventario/bienes']);
  }
}
