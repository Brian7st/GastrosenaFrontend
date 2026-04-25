import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../features/shared/components/navbar/navbar';
import { Footer } from '../../features/shared/components/footer/footer';
import { Chatbot } from '../../features/shared/components/chatbot/chatbot';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, Navbar, Footer, Chatbot],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss'
})
export class PublicLayout {}
