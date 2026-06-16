import { ajusteToRequest } from './inventory.mapper';
import { AjusteMovimientoData } from '../../models/movimiento.model';
import { AjusteRequest } from '../api/inventory.api';

describe('inventory.mapper — ajusteToRequest', () => {
  it('should map all fields correctly', () => {
    const data: AjusteMovimientoData = {
      producto:      'prod-uuid-001',
      cantidadNueva: 42,
      motivo:        'Conteo físico trimestral',
      autorizado:    true,
      referenciaId:  'ref-uuid-999',
    };

    const result: AjusteRequest = ajusteToRequest(data);

    expect(result).toEqual<AjusteRequest>({
      productoId:    'prod-uuid-001',
      cantidadNueva: 42,
      motivo:        'Conteo físico trimestral',
      autorizado:    true,
      referenciaId:  'ref-uuid-999',
    });
  });

  it('should default referenciaId to null when not provided', () => {
    const data: AjusteMovimientoData = {
      producto:      'prod-uuid-002',
      cantidadNueva: 0,
      motivo:        'Merma total',
      autorizado:    false,
    };

    const result = ajusteToRequest(data);

    expect(result.referenciaId).toBeNull();
  });

  it('should preserve autorizado=false', () => {
    const data: AjusteMovimientoData = {
      producto:      'prod-uuid-003',
      cantidadNueva: 10,
      motivo:        'Ajuste no autorizado',
      autorizado:    false,
    };

    expect(ajusteToRequest(data).autorizado).toBe(false);
  });

  it('should map producto field to productoId', () => {
    const data: AjusteMovimientoData = {
      producto:      'the-product-id',
      cantidadNueva: 5,
      motivo:        'Test',
      autorizado:    true,
    };

    expect(ajusteToRequest(data).productoId).toBe('the-product-id');
  });
});
