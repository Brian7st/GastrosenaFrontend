import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanitizerService } from '../../../shared/services/sanitizer.service';
import { SafeHtml } from '@angular/platform-browser';

interface ContactItem { icon: SafeHtml; label: string; values: string[]; }

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements OnInit {
  contactItems: ContactItem[] = [];

  constructor(private san: SanitizerService) {}

  ngOnInit(): void {
    this.contactItems = [
      { icon: this.san.safe(`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`), label: 'Ubicación', values: ['Centro de Formación SENA', 'Calle 57 No. 8-69', 'Bogotá D.C., Colombia'] },
      { icon: this.san.safe(`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>`), label: 'Teléfono', values: ['+57 (1) 546-1500 Ext. 4108', 'WhatsApp: +57 300 123 4567'] },
      { icon: this.san.safe(`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>`), label: 'Email', values: ['gastronomia@sena.edu.co', 'reservas.gastronomia@sena.edu.co'] },
      { icon: this.san.safe(`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`), label: 'Horarios', values: ['Lun - Jue: 10:00 - 22:00', 'Vie - Sáb: 10:00 - 23:00', 'Dom: Cerrado'] }
    ];
  }
}
