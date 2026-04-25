import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage { role: 'bot' | 'user'; text: string; }

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss'
})
export class Chatbot {
  @ViewChild('chatBody') chatBody!: ElementRef;

  isOpen    = false;
  inputText = '';
  showQuick = true;

  quickActions = [
    'Ver estado de mesas',
    'Productos con stock bajo',
    'Pedidos pendientes',
    'Ventas del día'
  ];

  messages: ChatMessage[] = [
    { role: 'bot', text: '¡Hola! Soy tu asistente virtual del sistema de restaurante. ¿En qué puedo ayudarte hoy?' }
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
    const q = query.toLowerCase();
    let reply = 'Para más información, por favor inicia sesión en el sistema.';
    if (q.includes('mesa'))    reply = 'Actualmente hay 8/12 mesas ocupadas (66%). ¡Hay disponibilidad!';
    if (q.includes('stock'))   reply = 'Productos con stock bajo: Tomates (5/20 kg), Aceite de Oliva (2/5 L).';
    if (q.includes('pedido'))  reply = 'Hay 4 pedidos activos: ORD-001 (preparando), ORD-002 (listo), ORD-003 (en espera).';
    if (q.includes('venta'))   reply = 'Las ventas del día alcanzan $2,450,000 — crecimiento del +12.5%.';
    if (q.includes('reserva')) reply = 'Para reservas: reservas.gastronomia@sena.edu.co o WhatsApp +57 300 123 4567.';
    if (q.includes('horario')) reply = 'Lun-Jue: 10:00-22:00 · Vie-Sáb: 10:00-23:00 · Dom: Cerrado.';
    this.addMessage('bot', reply);
  }

  help(): void {
    this.addMessage('bot', 'Puedo ayudarte con: estado de mesas, pedidos, ventas, stock bajo, horarios y reservas.');
  }

  clearChat(): void {
    this.messages  = [{ role: 'bot', text: '¡Chat limpiado! ¿En qué puedo ayudarte?' }];
    this.showQuick = true;
  }
}
