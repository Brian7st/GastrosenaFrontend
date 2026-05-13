import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from '../back-button/back-button.component';

export interface BreadcrumbItem {
  label: string;
  routerLink?: string;
}

@Component({
  selector: 'inventario-documento-registro',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  templateUrl: './documento-registro.component.html',
  styleUrl: './documento-registro.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentoRegistroComponent {
  @Input() title = 'Registrar Documento';
  @Input() subtitle = '';
  @Input() breadcrumbs: BreadcrumbItem[] = [];
  @Input() saveLabel = 'Registrar';
  @Input() saving = false;

  @Output() back   = new EventEmitter<void>();
  @Output() save   = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
