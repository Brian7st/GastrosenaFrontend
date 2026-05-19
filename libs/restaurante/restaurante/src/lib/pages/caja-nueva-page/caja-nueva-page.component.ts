import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  PageHeaderComponent, 
  CardComponent, 
  ButtonComponent,
  LucideIconComponent
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-caja-nueva-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    LucideIconComponent
  ],
  templateUrl: './caja-nueva-page.component.html',
  styleUrl: './caja-nueva-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaNuevaPageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  volver() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
