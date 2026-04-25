import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LUCIDE_ICONS, LucideIconData } from '@lucide/angular';

/**
 * Componente wrapper que emula la API de `lucide-angular` (legacy)
 * usando `@lucide/angular` v1.9+.
 *
 * Uso en templates: <lucide-icon name="arrow-left" [size]="18"></lucide-icon>
 *
 * Resuelve el ícono por nombre string consultando el registro inyectado
 * via `provideLucideIcons(...)`.
 */
@Component({
  selector: 'lucide-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      *ngIf="iconData"
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size"
      [attr.height]="size"
      [attr.viewBox]="'0 0 24 24'"
      fill="none"
      [attr.stroke]="color"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <ng-container *ngFor="let node of iconData.node">
        <ng-container [ngSwitch]="node[0]">
          <path      *ngSwitchCase="'path'"      [attr.d]="node[1]['d']" />
          <circle    *ngSwitchCase="'circle'"     [attr.cx]="node[1]['cx']" [attr.cy]="node[1]['cy']" [attr.r]="node[1]['r']" />
          <rect      *ngSwitchCase="'rect'"       [attr.x]="node[1]['x']" [attr.y]="node[1]['y']" [attr.width]="node[1]['width']" [attr.height]="node[1]['height']" [attr.rx]="node[1]['rx']" [attr.ry]="node[1]['ry']" />
          <line      *ngSwitchCase="'line'"       [attr.x1]="node[1]['x1']" [attr.y1]="node[1]['y1']" [attr.x2]="node[1]['x2']" [attr.y2]="node[1]['y2']" />
          <polyline  *ngSwitchCase="'polyline'"   [attr.points]="node[1]['points']" />
          <polygon   *ngSwitchCase="'polygon'"    [attr.points]="node[1]['points']" />
          <ellipse   *ngSwitchCase="'ellipse'"    [attr.cx]="node[1]['cx']" [attr.cy]="node[1]['cy']" [attr.rx]="node[1]['rx']" [attr.ry]="node[1]['ry']" />
        </ng-container>
      </ng-container>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      display: block;
    }
  `]
})
export class LucideIconComponent implements OnChanges {
  private readonly icons = inject(LUCIDE_ICONS);

  @Input() name = '';
  @Input() size: number | string = 24;
  @Input() color = 'currentColor';
  @Input() strokeWidth: number | string = 2;

  iconData: LucideIconData | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['name']) {
      this.resolveIcon();
    }
  }

  private resolveIcon(): void {
    if (!this.name) {
      this.iconData = null;
      return;
    }
    // Buscar en el registro de íconos
    if (this.name in this.icons) {
      this.iconData = this.icons[this.name];
    } else {
      // Intentar kebab-case -> camelCase lookup
      console.warn(`[lucide-icon] Ícono "${this.name}" no encontrado. Registra el ícono con provideLucideIcons().`);
      this.iconData = null;
    }
  }
}
