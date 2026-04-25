import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface InfoCard { svgPath: string; title: string; desc: string; }

@Component({
  selector: 'restaurant-general-info-section',
  standalone: true,
  imports: [],
  templateUrl: './general-info-section.component.html',
  styleUrl: './general-info-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInfoSectionComponent {
  readonly cards = signal<InfoCard[]>([
    { svgPath: 'M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5',                                                          title: 'Platos supervisados',  desc: 'Elaborados por estudiantes bajo la guía directa de chefs profesionales del programa SENA.' },
    { svgPath: 'M12 2a10 10 0 100 20A10 10 0 0012 2zM12 8v4l3 3',                                                                title: 'Ingredientes frescos', desc: 'Usamos insumos de primera calidad para garantizar sabor, presentación y valor nutricional.' },
    { svgPath: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', title: 'Accesible para todos', desc: 'Recetas y experiencias pensadas para toda la comunidad del centro de formación.' },
    { svgPath: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10',                                                     title: 'Formación técnica',    desc: 'Apoyamos la tecnología en gastronomía colombiana con prácticas reales y sistematizadas.' },
  ]);
}
