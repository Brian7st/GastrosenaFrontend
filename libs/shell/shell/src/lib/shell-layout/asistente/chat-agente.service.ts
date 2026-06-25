import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/** Respuesta del modo simple del agente. */
interface AgenteResponse {
  respuesta: string;
}

/**
 * Cliente del agente conversacional Gastrosena (GastroIA).
 *
 * Habla con la API HTTP del agente expuesta en `/api/agente` (proxy -> :9000).
 * Ofrece dos modos: `consultar` (respuesta completa) y `consultarStream`
 * (tokens en vivo via Server-Sent Events).
 */
@Injectable({ providedIn: 'root' })
export class ChatAgenteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/agente';

  /** Modo simple: espera la respuesta completa del agente. */
  consultar(mensaje: string): Observable<AgenteResponse> {
    return this.http.post<AgenteResponse>(this.baseUrl, { mensaje });
  }

  /** Modo streaming: emite la respuesta token a token. */
  async *consultarStream(mensaje: string): AsyncGenerator<string> {
    const res = await fetch(`${this.baseUrl}/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`Error del servidor: ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const eventos = buffer.split('\n\n');
      buffer = eventos.pop() ?? '';

      for (const ev of eventos) {
        const linea = ev.replace(/^data: /, '').trim();
        if (!linea) continue;

        const msg = JSON.parse(linea) as {
          delta?: string;
          error?: string;
          done?: boolean;
        };
        if (msg.error) throw new Error(msg.error);
        if (msg.delta) yield msg.delta;
        // msg.done -> fin del stream
      }
    }
  }
}
