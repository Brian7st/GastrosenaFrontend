import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  getPageTitle(): string {
    const titles: Record<string, string> = {
      '/dashboard':    'Panel Principal',
      '/restaurante':  'Restaurante',
      '/comandas': 'Gestión de Comandas',
      '/estadisticas': 'Estadísticas',
      '/facturacion':  'Facturación',
      '/configuracion':'Configuración',
    };
    return titles[window.location.pathname] ?? 'Panel Principal';
  }
}
