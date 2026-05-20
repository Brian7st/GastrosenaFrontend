import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-requisiciones-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
  templateUrl: './requisiciones-detalle.component.html',
  styleUrl: './requisiciones-detalle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesDetalleComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  reqId = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reqId.set(id);
    }
  }

  close(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
