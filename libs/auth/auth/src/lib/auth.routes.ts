import { Routes } from '@angular/router';
import { LoginPageComponent } from './ui/login-page.component';
import { ForgotPasswordPageComponent } from './ui/forgot-password-page/forgot-password-page.component';
import { ResetPasswordPageComponent } from './ui/reset-password-page/reset-password-page.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPageComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordPageComponent,
  },
];