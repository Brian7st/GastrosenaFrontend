import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { BienTypeaheadComponent } from './bien-typeahead.component';
import { BienesService } from '../../../data-access/services/bienes.service';
import { Bien } from '../../../models/inventario.model';

function bien(id: string, codigoSena: string, descripcion: string, valor: number): Bien {
  return {
    id,
    codigoSena,
    codigoProveedor: '',
    descripcion,
    categoria: 'Alimentos',
    unidadMedida: 'Litro',
    valor,
    valorNeto: null,
    iva: 0.19,
    estado: 'Activo',
    stockActual: 0,
    stockMinimo: 0,
    estadoStock: 'DISPONIBLE',
  };
}

const catalogo: Bien[] = [
  bien('b1', '283415', 'Aceite girasol', 32000),
  bien('b2', '273841', 'Aceite oliva', 60740),
];

describe('BienTypeaheadComponent', () => {
  let component: BienTypeaheadComponent;

  beforeEach(() => {
    const bienesStub = { buscarCatalogo: () => of(catalogo) };

    TestBed.configureTestingModule({
      imports: [BienTypeaheadComponent],
      providers: [{ provide: BienesService, useValue: bienesStub }],
    });

    const fixture = TestBed.createComponent(BienTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('no muestra sugerencias con query vacío', () => {
    expect(component.sugerencias()).toEqual([]);
  });

  it('filtra por cód almacén', () => {
    component.onInput('273841');
    expect(component.sugerencias().length).toBe(1);
    expect(component.sugerencias()[0].descripcion).toBe('Aceite oliva');
  });

  it('filtra por descripción sin distinguir mayúsculas', () => {
    component.onInput('girasol');
    expect(component.sugerencias().length).toBe(1);
    expect(component.sugerencias()[0].codigoSena).toBe('283415');
  });

  it('emite el bien al seleccionar (con cód almacén y precio) y limpia la query', () => {
    const emitted: Bien[] = [];
    component.seleccionar.subscribe(b => emitted.push(b));

    component.onInput('Aceite girasol');
    component.onEnter();

    expect(emitted.length).toBe(1);
    expect(emitted[0].codigoSena).toBe('283415');
    expect(emitted[0].valor).toBe(32000);
    expect(component.query()).toBe('');
  });
});
