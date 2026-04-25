import { signal } from '@angular/core';
import { AuthenticatedUser } from './auth.models';

export const currentUserSignal = signal<AuthenticatedUser | null>(null);
