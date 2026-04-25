import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comanda } from '../../../../core/models/comanda.model';

@Component({
  selector: 'app-comandas-tabla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comandas-tabla.component.html',
  styleUrls: ['./comandas-tabla.component.scss']
})
export class ComandasTablaComponent {
  @Input() comandas: Comanda[] = [];
  @Output() limpiar = new EventEmitter<void>();
  @Output() verDetalle = new EventEmitter<Comanda>();
}
