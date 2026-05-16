import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlertComponent,
  ButtonComponent,
  CardComponent,
  ConfirmDialogComponent,
  DataTableComponent,
  EmptyStateComponent,
  ExportButtonComponent,
  KeywordConfirmModalComponent,
  KpiCardComponent,
  LoadingSkeletonComponent,
  PageHeaderComponent,
  SearchFilterComponent,
  SectionTitleComponent,
  SelectFilterComponent,
  StatusBadgeComponent,
} from '@restaurant/shared/ui';

interface ShowcaseSection {
  id: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AlertComponent,
    ButtonComponent,
    CardComponent,
    ConfirmDialogComponent,
    DataTableComponent,
    EmptyStateComponent,
    ExportButtonComponent,
    KeywordConfirmModalComponent,
    KpiCardComponent,
    LoadingSkeletonComponent,
    PageHeaderComponent,
    SearchFilterComponent,
    SectionTitleComponent,
    SelectFilterComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly sections: ShowcaseSection[] = [
    {
      id: 'button',
      title: 'Button',
      description: 'Acciones principales, secundarias y de filtro en un contexto limpio.',
    },
    {
      id: 'feedback',
      title: 'Feedback',
      description: 'Estados compactos y mensajes claros para screenshots funcionales.',
    },
    {
      id: 'filters',
      title: 'Filtros',
      description: 'Search Filter y Select Filter en un escenario administrativo realista.',
    },
    {
      id: 'headers',
      title: 'Headers y títulos',
      description: 'Jerarquía de página y secciones sin ruido visual de una feature real.',
    },
    {
      id: 'data-display',
      title: 'Data display',
      description: 'KPIs, tabla, skeleton y empty state para documentar patrones de lectura.',
    },
    {
      id: 'confirmations',
      title: 'Confirmaciones',
      description: 'Patrones de fricción para acciones sensibles o irreversibles.',
    },
  ];

  protected readonly searchValue = signal('');
  protected readonly selectedState = signal('');
  protected readonly confirmOpen = signal(true);
  protected readonly keywordOpen = signal(true);

  protected readonly filterOptions = [
    { label: 'Todos', value: '' },
    { label: 'Activo', value: 'activo' },
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Anulado', value: 'anulado' },
  ];

  protected readonly rows = [
    { Placa: 'INV-1024', Descripción: 'Congelador vertical', Estado: 'Activo', Ubicación: 'Bodega central' },
    { Placa: 'INV-1088', Descripción: 'Licuadora industrial', Estado: 'Pendiente', Ubicación: 'Cocina' },
    { Placa: 'INV-1142', Descripción: 'Caja registradora', Estado: 'Anulado', Ubicación: 'Restaurante' },
  ];

  protected onSearchChange(value: string): void {
    this.searchValue.set(value);
  }

  protected onSelectChange(value: string): void {
    this.selectedState.set(value);
  }

  protected closeConfirm(): void {
    this.confirmOpen.set(false);
  }

  protected closeKeyword(): void {
    this.keywordOpen.set(false);
  }

  protected reopenDialogs(): void {
    this.confirmOpen.set(true);
    this.keywordOpen.set(true);
  }
}
