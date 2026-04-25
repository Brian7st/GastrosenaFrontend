import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanitizerService } from '../../../shared/services/sanitizer.service';
import { SafeHtml } from '@angular/platform-browser';

interface Feature { icon: SafeHtml; title: string; desc: string; }

@Component({
  selector: 'app-features',
  imports: [CommonModule],
  templateUrl: './features.html',
  styleUrl: './features.scss'
})
export class Features implements OnInit {
  features: Feature[] = [];

  constructor(private san: SanitizerService) {}

  ngOnInit(): void {
    this.features = [
      { icon: this.san.safe(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`), title: 'Platos supervisados',  desc: 'Elaborados por estudiantes bajo la guía directa de chefs profesionales del programa SENA.' },
      { icon: this.san.safe(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 8v4l3 3"/></svg>`),                                                                                                                     title: 'Ingredientes frescos',  desc: 'Usamos insumos de primera calidad para garantizar sabor, presentación y valor nutricional.' },
      { icon: this.san.safe(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/></svg>`),                                      title: 'Accesible para todos',  desc: 'Recetas y experiencias pensadas para toda la comunidad del centro de formación.' },
      { icon: this.san.safe(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>`),                                                                                                          title: 'Formación técnica',     desc: 'Apoyamos la tecnología en gastronomía colombiana con prácticas reales y sistematizadas.' }
    ];
  }
}
