import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

const FAQ: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['horario', 'hora', 'abierto', 'atienden'],
    answer: 'Atendemos de lunes a viernes de 7:00 am a 5:00 pm en el Centro de Comercio y Turismo SENA, Armenia.',
  },
  {
    keywords: ['ubicación', 'dirección', 'donde', 'dónde', 'lugar'],
    answer: 'Estamos en el Centro de Comercio y Turismo SENA, Armenia, Quindío. ¡Te esperamos!',
  },
  {
    keywords: ['precio', 'costo', 'valor', 'cuanto', 'cuánto'],
    answer: 'El menú del día está desde $12.000 COP. Los platos individuales varían entre $7.000 y $35.000 COP.',
  },
  {
    keywords: ['reserva', 'reservar', 'mesa', 'reservación'],
    answer: 'Para reservas escríbenos a gastronomia.quindio@sena.edu.co o llámanos al +57 (606) 741 0000.',
  },
  {
    keywords: ['menu', 'menú', 'platos', 'comida', 'carta'],
    answer: 'Ofrecemos menú del día, platos principales, postres, coctelería y especialidades de barismo con café colombiano.',
  },
  {
    keywords: ['café', 'espresso', 'barismo', 'cappuccino', 'latte'],
    answer: 'Nuestro bar de barismo ofrece espresso, latte, cold brew y más, todos preparados con café especial del Quindío.',
  },
  {
    keywords: ['sena', 'programa', 'aprendices', 'formación'],
    answer: 'GastroSENA es el restaurante escuela del programa de Gastronomía del SENA Quindío, atendido por aprendices y docentes.',
  },
  {
    keywords: ['contacto', 'teléfono', 'correo', 'email'],
    answer: 'Contáctanos por teléfono: +57 (606) 741 0000 o correo: gastronomia.quindio@sena.edu.co',
  },
];

const DEFAULT_ANSWER =
  'No estoy seguro de entender tu pregunta. ¿Puedes reformularla? Puedes preguntarme sobre horarios, menú, precios, ubicación o reservas.';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  sendMessage(message: string): Observable<string> {
    const lower = message.toLowerCase();
    const match = FAQ.find(faq =>
      faq.keywords.some(kw => lower.includes(kw))
    );
    return of(match?.answer ?? DEFAULT_ANSWER).pipe(delay(600));
  }
}
