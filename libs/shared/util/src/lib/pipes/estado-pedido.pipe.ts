import { Pipe, PipeTransform } from '@angular/core';
import { EstadoPedido } from '@restaurant/shared/models';

@Pipe({ name: 'estadoPedido', standalone: true })
export class EstadoPedidoPipe implements PipeTransform {
  transform(value: EstadoPedido): string {
    const labels: Record<EstadoPedido, string> = {
      [EstadoPedido.ESPERA]: 'En espera',
      [EstadoPedido.PREPARACION]: 'En preparación',
      [EstadoPedido.LISTO]: 'Listo',
      [EstadoPedido.ENTREGADO]: 'Entregado',
      [EstadoPedido.CANCELADO]: 'Cancelado',
    };

    return labels[value] ?? value;
  }
}
