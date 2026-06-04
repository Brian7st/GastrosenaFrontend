import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideBot, LucideMic, LucideSend, LucideX } from '@lucide/angular';
import { AsistenteUiService } from '../asistente-ui.service';
import { AsistentePerfil, MensajeChat } from '../asistente.models';

@Component({
  selector: 'restaurant-panel-asistente',
  standalone: true,
  imports: [CommonModule, LucideBot, LucideMic, LucideSend, LucideX],
  templateUrl: './panel-asistente.component.html',
  styleUrls: ['./panel-asistente.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelAsistenteComponent {
  protected readonly asistente = inject(AsistenteUiService);

  /** Perfil del asistente (mock — vendra del backend mas adelante). */
  protected readonly perfil: AsistentePerfil = {
    nombre: 'GastroIA',
    estado: 'En linea',
    enLinea: true,
  };

  /** Conversacion de ejemplo. Datos mock hasta conectar el backend. */
  protected readonly mensajes: MensajeChat[] = [
    {
      id: 'm1',
      autor: 'asistente',
      texto: '¡Hola! Soy GastroIA. ¿En que te puedo ayudar con el inventario hoy?',
    },
    {
      id: 'm2',
      autor: 'usuario',
      texto: '¿Cuanto stock queda de harina de trigo?',
      hora: '10:42 AM',
    },
    {
      id: 'm3',
      autor: 'asistente',
      texto:
        'Stock actual de Harina de trigo: 12 kg disponibles (minimo 50 kg). Estado: bajo stock — alerta activa.',
    },
  ];

  protected cerrar(): void {
    this.asistente.cerrar();
  }
}
