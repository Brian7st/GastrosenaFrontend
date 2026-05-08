import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { KpiCardComponent, DataTableComponent, LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

export interface Movimiento {
  id: string;
  tipo: 'ENTRADA' | 'SALIDA';
  productoNombre: string;
  productoSku: string;
  codigoSena: string;
  cantidad: number;
  unidad: string;
  fecha: string;
  hora: string;
  origenDestino: string;
  docOrigen: string;
  docUrl?: string;
  responsableNombre: string;
  responsableAvatar: string;
  valor: number;
  estado: 'Completado' | 'Pendiente' | 'Cancelado';
}

@Component({
  selector: 'inventario-movimientos-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    KpiCardComponent,
    DataTableComponent,
    LucideIconComponent,
    ButtonComponent
  ],
  templateUrl: './movimientos-list.component.html',
  styleUrls: ['./movimientos-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientosListComponent {
  movimientos: Movimiento[] = [
    {
      id: '1',
      tipo: 'ENTRADA',
      productoNombre: 'Cable UTP Cat 6a',
      productoSku: 'NET-CAT6A-01',
      codigoSena: 'AOL001',
      cantidad: 150,
      unidad: 'Metros',
      fecha: '15 Oct 2023',
      hora: '09:45 AM',
      origenDestino: 'Proveedor: TechGlobal',
      docOrigen: 'FAC-2025-001',
      responsableNombre: 'Carlos R.',
      responsableAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL3CSTItfWD4YeP4tBropVQQpaGuPa1dotP9gmoMXb_luep_as6XrKjIMHF7Gm75BJmyYWMrxUBLXGhnJiy5un6CK5Vni9E91mIehrSLXot42IVkEwlRRDBnUQsB1PhGUQItONLUTjo5Rl-6hqamKz8QC-WQycvVKq80iGEyZyq0PFyxmu2e3fVVpY6PWCAh0MJpyHXL3FgfnPHnNa59w9EskgX0TLi3DJBdjd9BxAA6yN3nwxYS3a-I9ngkhGCpS5q3YDyHjMMH_4',
      valor: 450000,
      estado: 'Completado'
    },
    {
      id: '2',
      tipo: 'SALIDA',
      productoNombre: 'Multímetro Digital Pro',
      productoSku: 'TOOL-DMM-05',
      codigoSena: 'HTP002',
      cantidad: 12,
      unidad: 'Unidades',
      fecha: '15 Oct 2023',
      hora: '11:20 AM',
      origenDestino: 'Laboratorio de Electrónica',
      docOrigen: 'GIL-2024-089',
      responsableNombre: 'Ana M.',
      responsableAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNMHzfmgF59DFInpnjk8QDwlE7e63ugRaQNWIGkRGRtaymmwBQxnN43fziIYqgWKNogykd2btoq6WLCFwpQo0ZgH2gf-27RdZFwydDlyfVTYEwbXUVZ9lOJbCpYPDzIdPvy697tBvLiOURyAiNYARstveZoERy2CA5YW_rKs40yi4qa9EzFauyJX1BmnowHArorVTAi36KURiR4MMNdZ8oEX3E4W8GUeY7Lo5iaVUpGnWv2O3gJxYKOCbyjakslZQMVHNiTOQ8clSw',
      valor: 1240000,
      estado: 'Pendiente'
    },
    {
      id: '3',
      tipo: 'ENTRADA',
      productoNombre: 'Conector RJ45 blindado',
      productoSku: 'NET-RJ45-B',
      codigoSena: 'TCP003',
      cantidad: 1000,
      unidad: 'Piezas',
      fecha: '14 Oct 2023',
      hora: '04:15 PM',
      origenDestino: 'Stock General',
      docOrigen: 'FAC-2025-003',
      responsableNombre: 'SISTEMA',
      responsableAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHsz7jg8fgAAOqnqtKlay6aAvY61kcwQlVhdGuM9hQjtgk1Iprwm2PRI4v3atNrqpdUwP5jBqORYPtA79HfEys_dTBLhvUhWX90FJdp6eTOxIA5-25Hn_J6Bgq3S5zTQ_YJN1LrF1t3jd0xFN0S7oy4VmRDA31hFCaJjDfRMsz994JkonUsvplnNHA1-lToM3rP3MwQfH63Z8cgMuO8BHVR44I-TmMBq61vylWtMV6s8SB2Iu45kuA7pphREDzaTLpFpKAuKxK0ctv',
      valor: 85000,
      estado: 'Completado'
    }
  ];
}
