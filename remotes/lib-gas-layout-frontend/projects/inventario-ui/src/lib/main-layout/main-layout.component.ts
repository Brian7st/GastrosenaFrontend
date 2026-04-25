import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BarraLateralComponent } from '../barra-lateral/barra-lateral.component';
import { BarraSuperiorComponent } from '../barra-superior/barra-superior.component';
import { BarraLateralConfig, PerfilConfig, TopNavLink } from '../models/nav.models';

@Component({
  selector: 'lib-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, BarraLateralComponent, BarraSuperiorComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  @Input() sidebarConfig: BarraLateralConfig = { titulo: 'Mi App', grupos: [] };
  @Input() perfil: PerfilConfig = {};
  @Input() buscarPlaceholder = 'Buscar...';
  @Input() topMenu: TopNavLink[] = [];
}
