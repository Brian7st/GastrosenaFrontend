import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'restaurant-solicitudes-export',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './solicitudes-export.component.html',
  styleUrl: './solicitudes-export.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesExportComponent {
  solicitudId = signal<string>('GIL-F-014-2024-001');

  constructor(private router: Router, private route: ActivatedRoute) {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.solicitudId.set(`GIL-F-014-2024-${paramId}`);
    }
  }

  onClose(): void {
    const rawId = this.route.snapshot.paramMap.get('id') || '001';
    this.router.navigate(['/app/inventario/solicitudes-gil', rawId]);
  }
}
