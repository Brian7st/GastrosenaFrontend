import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChatMessage { role: 'bot' | 'user'; text: string; }

const FAQ: { keywords: string[]; answer: string }[] = [
  { keywords: ['horario', 'hora', 'abierto'],      answer: 'Atendemos de lunes a viernes de 7:00 am a 5:00 pm en el Centro SENA, Armenia.' },
  { keywords: ['ubicación', 'dirección', 'donde'], answer: 'Estamos en el Centro de Comercio y Turismo SENA, Armenia, Quindío.' },
  { keywords: ['precio', 'costo', 'cuanto'],       answer: 'El menú del día desde $12.000 COP. Platos entre $7.000 y $35.000 COP.' },
  { keywords: ['reserva', 'reservar', 'mesa'],     answer: 'Para reservas: gastronomia.quindio@sena.edu.co o +57 (606) 741 0000.' },
  { keywords: ['menu', 'menú', 'platos', 'carta'], answer: 'Ofrecemos menú del día, platos principales, postres, coctelería y barismo.' },
  { keywords: ['café', 'barismo', 'espresso'],     answer: 'Bar de barismo con espresso, latte, cold brew y café especial del Quindío.' },
];

@Component({
  selector: 'restaurant-public-chatbot',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './public-chatbot.component.html',
  styleUrl: './public-chatbot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicChatbotComponent {
  @ViewChild('chatBody') chatBody!: ElementRef;

  isOpen     = false;
  inputText  = '';
  showQuick  = true;

  quickActions = ['Ver el menú', 'Horarios de atención', 'Precios', 'Hacer una reserva'];

  messages: ChatMessage[] = [
    { role: 'bot', text: '¡Hola! Soy tu asistente de GastroSENA. ¿En qué puedo ayudarte?' }
  ];

  toggle(): void { this.isOpen = !this.isOpen; }

  send(): void {
    const text = this.inputText.trim();
    if (!text) return;
    this.addMessage('user', text);
    this.inputText = '';
    this.showQuick = false;
    setTimeout(() => this.botReply(text), 600);
  }

  sendQuick(q: string): void {
    this.addMessage('user', q);
    this.showQuick = false;
    setTimeout(() => this.botReply(q), 600);
  }

  private addMessage(role: 'bot' | 'user', text: string): void {
    this.messages.push({ role, text });
    setTimeout(() => {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    }, 50);
  }

  private botReply(query: string): void {
    const lower = query.toLowerCase();
    const match = FAQ.find(f => f.keywords.some(kw => lower.includes(kw)));
    this.addMessage('bot', match?.answer ?? 'Para más información, puedes contactarnos al +57 (606) 741 0000.');
  }

  clearChat(): void {
    this.messages  = [{ role: 'bot', text: '¡Chat limpiado! ¿En qué puedo ayudarte?' }];
    this.showQuick = true;
  }
}
