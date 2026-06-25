import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bien } from '../../../models/inventario.model';
import { BienStatusBadgeComponent } from '../bien-status-badge/bien-status-badge.component';

@Component({
  selector: 'restaurant-bien-table',
  standalone: true,
  imports: [CommonModule, BienStatusBadgeComponent],
  templateUrl: './bien-table.component.html',
  styleUrl: './bien-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienTableComponent {
  @Input({ required: true }) bienes: Bien[] = [];
  @Input() isLoading = false;
  @Input() selectMode = false;
  @Input() addedCodigosSena: string[] = [];

  @Output() edit = new EventEmitter<Bien>();
  @Output() view = new EventEmitter<Bien>();
  @Output() delete = new EventEmitter<Bien>();
  @Output() bieneSelected = new EventEmitter<Bien>();

  onEdit(bien: Bien) { this.edit.emit(bien); }
  onView(bien: Bien) { this.view.emit(bien); }
  onDelete(bien: Bien) { this.delete.emit(bien); }
  onSelect(bien: Bien) { this.bieneSelected.emit(bien); }

  isAdded(bien: Bien): boolean {
    return this.addedCodigosSena.includes(bien.codigoSena ?? '');
  }
}
