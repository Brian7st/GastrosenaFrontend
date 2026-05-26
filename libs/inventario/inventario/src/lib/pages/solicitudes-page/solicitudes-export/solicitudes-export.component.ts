import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';

import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'restaurant-solicitudes-export',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './solicitudes-export.component.html',
  styleUrl: './solicitudes-export.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesExportComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  solicitudId = signal<string>('GIL-F-014-2024-001');

  ngOnInit(): void {
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
