import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { CommentRequest, CommentResponse } from '../models/home.models';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  sendComment(comment: CommentRequest): Observable<CommentResponse> {
    console.log('Comentario recibido (mock):', comment);
    return of({
      success: true,
      message: '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.',
    }).pipe(delay(800));
  }
}
