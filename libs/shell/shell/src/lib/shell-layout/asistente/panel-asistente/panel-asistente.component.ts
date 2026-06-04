import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { LucideBrainCircuit, LucideSend, LucideX } from '@lucide/angular';
import { AsistenteUiService } from '../asistente-ui.service';
import { ChatAgenteService } from '../chat-agente.service';
import { AsistentePerfil, MensajeChat } from '../asistente.models';

@Component({
  selector: 'restaurant-panel-asistente',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownComponent, LucideBrainCircuit, LucideSend, LucideX],
  templateUrl: './panel-asistente.component.html',
  styleUrls: ['./panel-asistente.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelAsistenteComponent {
  protected readonly asistente = inject(AsistenteUiService);
  private readonly chat = inject(ChatAgenteService);

  /** Perfil del asistente (mock — vendra del backend mas adelante). */
  protected readonly perfil: AsistentePerfil = {
    nombre: 'GastroIA',
    estado: 'En linea',
    enLinea: true,
  };

  /** Hilo de la conversacion. Arranca con el saludo de bienvenida. */
  protected readonly mensajes = signal<MensajeChat[]>([
    {
      id: crypto.randomUUID(),
      autor: 'asistente',
      texto: '¡Hola! Soy GastroIA. ¿En que te puedo ayudar hoy?',
    },
  ]);

  /** Texto que escribe el usuario en el campo de entrada. */
  protected texto = '';

  /** Hay una consulta en curso (deshabilita el envio). */
  protected readonly enviando = signal(false);

  protected async enviar(): Promise<void> {
    const pregunta = this.texto.trim();
    if (!pregunta || this.enviando()) return;

    this.mensajes.update((m) => [
      ...m,
      { id: crypto.randomUUID(), autor: 'usuario', texto: pregunta, hora: this.ahora() },
    ]);
    this.texto = '';
    this.enviando.set(true);

    // Burbuja del agente que se va llenando token a token.
    const idAgente = crypto.randomUUID();
    this.mensajes.update((m) => [...m, { id: idAgente, autor: 'asistente', texto: '' }]);

    try {
      for await (const chunk of this.chat.consultarStream(pregunta)) {
        this.mensajes.update((m) =>
          m.map((msg) => (msg.id === idAgente ? { ...msg, texto: msg.texto + chunk } : msg))
        );
      }
    } catch (e) {
      const error = `⚠️ Error: ${(e as Error).message}`;
      this.mensajes.update((m) =>
        m.map((msg) => (msg.id === idAgente ? { ...msg, texto: error } : msg))
      );
    } finally {
      this.enviando.set(false);
    }
  }

  protected cerrar(): void {
    this.asistente.cerrar();
  }

  private ahora(): string {
    return new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
