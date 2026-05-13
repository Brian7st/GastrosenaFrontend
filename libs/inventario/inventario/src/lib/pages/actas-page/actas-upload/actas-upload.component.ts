import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-actas-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './actas-upload.component.html',
  styleUrls: ['./actas-upload.component.scss'],
})
export class ActasUploadComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isDragging = signal(false);

  cerrar(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
