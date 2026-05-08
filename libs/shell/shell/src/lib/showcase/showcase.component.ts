import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AlertComponent,
  ButtonComponent,
  CardComponent,
  ConfirmDialogComponent,
  DataTableComponent,
  EmptyStateComponent,
  ExportButtonComponent,
  InputComponent,
  KeywordConfirmModalComponent,
  KpiCardComponent,
  LoadingSkeletonComponent,
  LucideIconComponent,
  PageHeaderComponent,
  SearchFilterComponent,
  SectionTitleComponent,
  SelectFilterComponent,
  StatusBadgeComponent,
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-showcase',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonComponent,
    CardComponent,
    ConfirmDialogComponent,
    DataTableComponent,
    EmptyStateComponent,
    ExportButtonComponent,
    InputComponent,
    KeywordConfirmModalComponent,
    KpiCardComponent,
    LoadingSkeletonComponent,
    LucideIconComponent,
    PageHeaderComponent,
    SearchFilterComponent,
    SectionTitleComponent,
    SelectFilterComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseComponent {
  confirmOpen = signal(false);
  keywordOpen = signal(false);
  keywordWarningOpen = signal(false);
  searchValue = signal('');
  selectValue = signal('');
  inputValue = signal('');

  tableColumns = ['Nombre', 'Estado', 'Cantidad'];
  tableRows = [
    { Nombre: 'Producto A', Estado: 'Activo', Cantidad: 10 },
    { Nombre: 'Producto B', Estado: 'Inactivo', Cantidad: 0 },
    { Nombre: 'Producto C', Estado: 'Alerta', Cantidad: 3 },
  ];

  selectOptions = [
    { label: 'Opción A', value: 'a' },
    { label: 'Opción B', value: 'b' },
    { label: 'Opción C', value: 'c' },
  ];

  lucideIcons = [
    'search', 'filter', 'plus', 'trash-2', 'pencil', 'eye',
    'download', 'upload', 'refresh-cw', 'settings', 'user',
    'bar-chart-2', 'trending-up', 'trending-down', 'landmark',
    'warehouse', 'file-text', 'banknote', 'receipt', 'package',
    'check-circle', 'x-circle', 'alert-circle', 'info',
    'log-out', 'chef-hat', 'coffee', 'utensils', 'clock',
  ];
}
