import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideBell, LucideBrainCircuit, LucideDynamicIcon, LucideMoon, LucideSearch, LucideSun, LucideUser } from '@lucide/angular';
import { PerfilConfig, TopNavLink } from '../../nav/nav.models';

@Component({
  selector: 'restaurant-barra-superior',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideBell, LucideBrainCircuit, LucideDynamicIcon, LucideMoon, LucideSearch, LucideSun, LucideUser],
  templateUrl: './barra-superior.component.html',
  styleUrls: ['./barra-superior.component.scss'],
})
export class BarraSuperiorComponent {
  @Input() perfil: PerfilConfig = {};
  @Input() buscarPlaceholder = 'Buscar...';
  @Input() enlaces: TopNavLink[] = [];
  @Input() sidebarColapsada = false;

  @Output() readonly toggleSidebar = new EventEmitter<void>();

  readonly esOscuro = signal(false);

  alternarTema(): void {
    this.esOscuro.update(v => !v);
  }
}
