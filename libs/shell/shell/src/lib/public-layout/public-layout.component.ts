import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicNavbarComponent }  from './navbar/public-navbar.component';
import { PublicFooterComponent }  from './footer/public-footer.component';
import { PublicChatbotComponent } from './chatbot/public-chatbot.component';

@Component({
  selector: 'restaurant-public-layout',
  standalone: true,
  imports: [RouterOutlet, PublicNavbarComponent, PublicFooterComponent, PublicChatbotComponent],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {}
