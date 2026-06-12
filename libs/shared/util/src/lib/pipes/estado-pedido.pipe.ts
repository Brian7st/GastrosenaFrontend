import { Pipe, PipeTransform } from '@angular/core';
import { EstadoPedido } from '@restaurant/shared/models';

@Pipe({ name: 'estadoPedido', standalone: true })
export class EstadoPedidoPipe implements PipeTransform {
  transform(value: EstadoPedido): string {
    const labels: Record<EstadoPedido, string> = {
      [EstadoPedido.BORRADOR]: 'Borrador',
      [EstadoPedido.ENVIADO_COCINA]: 'Enviado a cocina',
      [EstadoPedido.EN_PREPARACION]: 'En preparación',
      [EstadoPedido.LISTO_PARA_SERVIR]: 'Listo para servir',
      [EstadoPedido.ENTREGADO]: 'Entregado',
      [EstadoPedido.FACTURADO]: 'Facturado',
      [EstadoPedido.CANCELADO]: 'Cancelado',
    };

    return labels[value] || value;
  }
}
