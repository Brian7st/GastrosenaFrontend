import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideDynamicIcon, LucideBox, LucideSettings, LucideUser, LucideLogOut } from '@lucide/angular';
import { BarraLateralConfig } from '../models/nav.models';

@Component({
  selector: 'lib-barra-lateral',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideDynamicIcon, LucideBox, LucideSettings, LucideUser, LucideLogOut],
  templateUrl: './barra-lateral.component.html',
  styleUrls: ['./barra-lateral.component.scss']
})
export class BarraLateralComponent {
  @Input() config: BarraLateralConfig = {
    titulo: 'Mi App',
    subtitulo: '',
    logoUrl: '',
    grupos: []
  };
}
