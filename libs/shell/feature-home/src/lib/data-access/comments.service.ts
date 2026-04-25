import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { CommentRequest, CommentResponse } from '../models/home.models';

// TODO: replace with real HTTP POST via BaseHttpService
@Injectable({ providedIn: 'root' })
export class CommentsService {
  sendComment(_comment: CommentRequest): Observable<CommentResponse> {
    return of({
      success: true,
      message: '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.',
    }).pipe(delay(800));
  }
}
