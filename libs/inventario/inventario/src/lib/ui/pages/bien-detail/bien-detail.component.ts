import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideIconComponent, PageHeaderComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { Bien, MovimientoBien } from '../../../models/inventario.model';
import { BienesService } from '../../../data-access/services/bienes.service';
import { BienStatusBadgeComponent } from '../../components/bien-status-badge/bien-status-badge.component';

@Component({
  selector: 'restaurant-bien-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent, PageHeaderComponent, StatusBadgeComponent, BienStatusBadgeComponent],
  templateUrl: './bien-detail.component.html',
  styleUrl: './bien-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bienesService = inject(BienesService);

  bien = signal<Bien | undefined>(undefined);
  movimientos = signal<MovimientoBien[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(id);
    }
  }

  private loadData(id: string): void {
    this.loading.set(true);
    this.bienesService.getBienById(id).subscribe(data => {
      this.bien.set(data);
      this.loading.set(false);
      // Cargar movimientos mock
      this.movimientos.set([
        { id: 1, fecha: '2024-05-14', tipo: 'ENTRADA', responsable: 'Admin Central', ubicacion: 'Almacén General', cantidad: 5, observacion: 'Reposición de stock anual' },
        { id: 2, fecha: '2024-04-22', tipo: 'SALIDA', responsable: 'Coord. Sistemas', ubicacion: 'Laboratorio 302', cantidad: -2, observacion: 'Asignación a nuevos instructores' }
      ]);
    });
  }

  onVolver(): void {
    this.router.navigate(['/inventario']);
  }
}
