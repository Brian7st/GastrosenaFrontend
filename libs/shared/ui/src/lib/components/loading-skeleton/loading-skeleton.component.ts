import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'restaurant-loading-skeleton',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="loading-skeleton">
      <div class="loading-skeleton__line" *ngFor="let item of items"></div>
    </div>
  `,
  styleUrl: './loading-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSkeletonComponent {
  @Input() lines = 3;

  get items(): number[] {
    return Array.from({ length: this.lines }, (_, index) => index);
  }
}
