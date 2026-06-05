import { conciliacionGilFromApi } from './sourcing.mapper';
import { ConciliacionGilResponse } from '../api/sourcing.api';

describe('conciliacionGilFromApi — cantidadRecibida mapping', () => {
  const baseResponse: ConciliacionGilResponse = {
    id: 'conc-1',
    facturaId: 'fac-1',
    gilId: 'gil-1',
    estado: 'CONCILIADO',
    diferenciasPendientes: 0,
    detalles: [],
  };

  it('maps cantidadRecibida when API returns a number', () => {
    const response: ConciliacionGilResponse = {
      ...baseResponse,
      detalles: [
        {
          gilItemId: 'item-1',
          descripcion: 'Bien A',
          cantidadGil: 5,
          cantidadFactura: 4,
          precioUnitarioGil: 100,
          precioUnitarioFactura: 100,
          porcentajeIvaGil: 19,
          porcentajeIvaFactura: 19,
          estado: 'DIFERENCIA_PENDIENTE',
          cantidadRecibida: 4,
        },
      ],
    };

    const result = conciliacionGilFromApi(response);
    expect(result.diferencias[0].cantidadRecibida).toBe(4);
  });

  it('maps cantidadRecibida as null when API returns null', () => {
    const response: ConciliacionGilResponse = {
      ...baseResponse,
      detalles: [
        {
          gilItemId: 'item-2',
          descripcion: 'Bien B',
          cantidadGil: 3,
          cantidadFactura: 3,
          precioUnitarioGil: 50,
          precioUnitarioFactura: 60,
          porcentajeIvaGil: 0,
          porcentajeIvaFactura: 0,
          estado: 'DIFERENCIA_PENDIENTE',
          cantidadRecibida: null,
        },
      ],
    };

    const result = conciliacionGilFromApi(response);
    expect(result.diferencias[0].cantidadRecibida).toBeNull();
  });

  it('filters out OK detalles — they do not appear in diferencias', () => {
    const response: ConciliacionGilResponse = {
      ...baseResponse,
      detalles: [
        {
          gilItemId: 'item-ok',
          descripcion: 'OK item',
          cantidadGil: 2,
          cantidadFactura: 2,
          precioUnitarioGil: 10,
          precioUnitarioFactura: 10,
          porcentajeIvaGil: 0,
          porcentajeIvaFactura: 0,
          estado: 'OK',
          cantidadRecibida: 2,
        },
      ],
    };

    const result = conciliacionGilFromApi(response);
    expect(result.diferencias.length).toBe(0);
  });
});
