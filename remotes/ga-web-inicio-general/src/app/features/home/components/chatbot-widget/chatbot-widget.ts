import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';

interface Message {
  from: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chatbot-widget.html',
  styleUrl: './chatbot-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotWidgetComponent {
  private chatbotService = inject(ChatbotService);

  isOpen    = signal(false);
  messages  = signal<Message[]>([{ from: 'bot', text: '¡Hola! Soy el asistente de GastroSENA. ¿En qué puedo ayudarte? Puedes preguntarme sobre horarios, menú, precios o ubicación.' }]);
  inputText = signal('');
  isLoading = signal(false);

  toggleOpen(): void {
    this.isOpen.update(v => !v);
  }

  sendMessage(): void {
    const text = this.inputText().trim();
    if (!text || this.isLoading()) return;

    this.messages.update(msgs => [...msgs, { from: 'user', text }]);
    this.inputText.set('');
    this.isLoading.set(true);

    this.chatbotService.sendMessage(text).subscribe(response => {
      this.messages.update(msgs => [...msgs, { from: 'bot', text: response }]);
      this.isLoading.set(false);
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
