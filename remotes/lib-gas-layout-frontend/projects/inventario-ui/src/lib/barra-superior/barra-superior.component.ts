import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideSearch, LucideBell, LucideUser } from '@lucide/angular';
import { PerfilConfig, TopNavLink } from '../models/nav.models';

@Component({
  selector: 'lib-barra-superior',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideSearch, LucideBell, LucideUser],
  templateUrl: './barra-superior.component.html',
  styleUrls: ['./barra-superior.component.scss']
})
export class BarraSuperiorComponent {
  @Input() perfil: PerfilConfig = {};
  @Input() buscarPlaceholder = 'Buscar...';
  @Input() enlaces: TopNavLink[] = [];
}
