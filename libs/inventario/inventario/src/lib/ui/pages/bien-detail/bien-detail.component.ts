import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Bien, MovimientoBien } from '../../../models/inventario.model';
import { BienesService } from '../../../data-access/services/bienes.service';
import { BienFormComponent } from '../../modals/bien-form/bien-form.component';
import { BienFormDto } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-bien-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BienFormComponent],
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
  showEditModal = signal(false);

  espec = computed(() => {
    const b = this.bien();
    return b?.especificaciones ? Object.entries(b.especificaciones) : [];
  });

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
      this.movimientos.set([
        { id: 1, fecha: '2024-05-14', tipo: 'ENTRADA', responsable: 'Admin Central', ubicacion: 'Almacén General', cantidad: 5, observacion: 'Reposición de stock anual' },
        { id: 2, fecha: '2024-04-22', tipo: 'SALIDA', responsable: 'Coord. Sistemas', ubicacion: 'Laboratorio 302', cantidad: -2, observacion: 'Asignación a nuevos instructores' },
        { id: 3, fecha: '2024-03-10', tipo: 'TRASLADO', responsable: 'Gestión Activos', ubicacion: 'Sede Norte', cantidad: 0, observacion: 'Mantenimiento preventivo trimestral' },
      ]);
    });
  }

  onVolver(): void {
    this.router.navigate(['/app/inventario/bienes']);
  }

  onEditarActivo(): void {
    this.showEditModal.set(true);
  }

  onSaveEdit(dto: BienFormDto): void {
    console.log('Actualizando bien:', dto);
    this.showEditModal.set(false);
  }

  onExportarHistorial(): void {
    console.log('Exportando historial del bien:', this.bien()?.codigoSena);
  }

  getTipoClass(tipo: string): string {
    const map: Record<string, string> = { 'ENTRADA': 'entrada', 'SALIDA': 'salida', 'TRASLADO': 'traslado' };
    return map[tipo] ?? '';
  }

  getTipoLabel(tipo: string): string {
    const map: Record<string, string> = { 'ENTRADA': 'ENTRADA', 'SALIDA': 'SALIDA', 'TRASLADO': 'TRASLADO' };
    return map[tipo] ?? tipo;
  }

  getCantidadPrefix(cantidad: number): string {
    if (cantidad > 0) return `+${cantidad}`;
    if (cantidad < 0) return `${cantidad}`;
    return '0';
  }

  getCantidadClass(cantidad: number): string {
    if (cantidad > 0) return 'cantidad--positiva';
    if (cantidad < 0) return 'cantidad--negativa';
    return '';
  }

  getEstadoFacturaClass(estado: string): string {
    const map: Record<string, string> = { 'PAGADA': 'factura-estado--pagada', 'CAUSADA': 'factura-estado--causada', 'PENDIENTE': 'factura-estado--pendiente' };
    return map[estado] ?? '';
  }
}
