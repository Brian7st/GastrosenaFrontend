import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { signal, WritableSignal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { mock, instance, when, verify, anything, anyString } from 'ts-mockito';
import { GestionRecetaComponent } from './gestion-receta.component';
import { RecetaService } from '../../data-access/receta.service';
import { CategoriaService } from '../../data-access/categoria.service';
import { IngredienteService } from '../../data-access/ingrediente.service';
import { Receta } from '../../models/receta.model';

describe('GestionRecetaComponent', () => {
  let component: GestionRecetaComponent;
  let fixture: ComponentFixture<GestionRecetaComponent>;
  let mockRecetaService: RecetaService;
  let mockCategoriaService: CategoriaService;
  let mockIngredienteService: IngredienteService;

  // Creamos señales reales para usarlas como valores de retorno en los mocks
  let categoriasSignal: WritableSignal<any[]>;
  let ingredientesSignal: WritableSignal<any[]>;

  // Datos mock de prueba
  const mockReceta: Receta = {
    idReceta: 'RB-100',
    nombreReceta: 'Mock Cocktail',
    idCategoria: '1',
    nombreCategoria: 'Cócteles',
    temperatura: 'Fría',
    tiempoPreparacion: 5,
    precioUnitario: 15000,
    urlImagen: 'http://test.com/image.jpg',
    ingredientes: [
      { nombreIngrediente: 'Menta', cantidadRequerida: 5, unidadMedida: 'GR' }
    ],
    pasos: [
      { orden: 1, descripcionPaso: 'Mezclar todo.' }
    ]
  };

  beforeEach(async () => {
    // Inicializar mocks usando ts-mockito
    mockRecetaService = mock(RecetaService);
    mockCategoriaService = mock(CategoriaService);
    mockIngredienteService = mock(IngredienteService);

    // Crear señales reales para los servicios
    categoriasSignal = signal([
      { idCategoria: '1', nombreCategoria: 'Cócteles' },
      { idCategoria: '2', nombreCategoria: 'Bebidas Calientes' }
    ]);
    ingredientesSignal = signal([
      { idIngrediente: '1', nombreIngrediente: 'Menta' },
      { idIngrediente: '2', nombreIngrediente: 'Limón' }
    ]);

    // Configurar comportamientos en los mocks con ts-mockito
    when(mockCategoriaService.categorias).thenReturn(categoriasSignal);
    when(mockIngredienteService.ingredientes).thenReturn(ingredientesSignal as any);

    when(mockCategoriaService.listar()).thenReturn();
    when(mockIngredienteService.listarIngredientes()).thenReturn();

    // Stub para guardar y actualizar recetas
    when(mockRecetaService.guardarRecetaCompleta(anything())).thenReturn(of({ idReceta: 'NEW-001' }));
    when(mockRecetaService.actualizarRecetaCompleta(anyString(), anything())).thenReturn(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [GestionRecetaComponent, ReactiveFormsModule],
      providers: [
        { provide: RecetaService, useValue: instance(mockRecetaService) },
        { provide: CategoriaService, useValue: instance(mockCategoriaService) },
        { provide: IngredienteService, useValue: instance(mockIngredienteService) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionRecetaComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente e inicializar listas de dependencias', () => {
    fixture.detectChanges(); // Ejecuta ngOnInit
    
    expect(component).toBeTruthy();
    verify(mockCategoriaService.listar()).once();
    verify(mockIngredienteService.listarIngredientes()).once();
  });

  describe('Formulario de Receta - Validaciones y Controles', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería inicializar el formulario inválido por defecto', () => {
      expect(component.recipeForm.valid).toBeFalsy();
      expect(component.recipeForm.get('nombreReceta')?.value).toBe('');
    });

    it('debería marcar el campo nombreReceta como inválido si tiene menos de 5 letras', () => {
      const control = component.recipeForm.get('nombreReceta');
      control?.setValue('Moc');
      control?.markAsTouched();
      fixture.detectChanges();

      expect(component.esCampoInvalido('nombreReceta')).toBe(true);
      expect(control?.valid).toBeFalsy();
    });

    it('debería validar ingredientes duplicados con noDuplicatesValidator', () => {
      component.agregarIngrediente();
      component.agregarIngrediente();

      const ingArray = component.ingredientesArr;
      
      // Asignar el mismo nombre a ambos ingredientes
      ingArray.at(0).get('nombreIngrediente')?.setValue('Limón');
      ingArray.at(1).get('nombreIngrediente')?.setValue('Limón');
      
      ingArray.updateValueAndValidity();
      
      expect(ingArray.hasError('duplicate')).toBe(true);
    });

    it('debería permitir agregar y remover ingredientes del formulario', () => {
      expect(component.ingredientesArr.length).toBe(0);

      component.agregarIngrediente();
      expect(component.ingredientesArr.length).toBe(1);

      component.removerIngrediente(0);
      expect(component.ingredientesArr.length).toBe(0);
    });

    it('debería permitir agregar y remover pasos (instrucciones) del formulario', () => {
      expect(component.pasosArr.length).toBe(0);

      component.agregarPaso();
      expect(component.pasosArr.length).toBe(1);
      expect(component.pasosArr.at(0).get('orden')?.value).toBe(1);

      component.agregarPaso();
      expect(component.pasosArr.length).toBe(2);
      expect(component.pasosArr.at(1).get('orden')?.value).toBe(2);

      component.removerPaso(0);
      expect(component.pasosArr.length).toBe(1);
      // El paso restante debería reordenarse al índice 1
      expect(component.pasosArr.at(0).get('orden')?.value).toBe(1);
    });
  });

  describe('Carga para Edición', () => {
    it('debería cargar datos en el formulario si se pasa una receta como Input', () => {
      component.receta = mockReceta;
      fixture.detectChanges(); // ngOnInit cargará los datos

      expect(component.recipeForm.get('nombreReceta')?.value).toBe('Mock Cocktail');
      expect(component.recipeForm.get('idCategoria')?.value).toBe('1');
      expect(component.ingredientesArr.length).toBe(1);
      expect(component.ingredientesArr.at(0).get('nombreIngrediente')?.value).toBe('Menta');
      expect(component.pasosArr.length).toBe(1);
      expect(component.pasosArr.at(0).get('descripcionPaso')?.value).toBe('Mezclar todo.');
    });
  });

  describe('Operaciones de Guardado (Guardar / Actualizar)', () => {
    beforeEach(() => {
      fixture.detectChanges();
      
      // Espiar la emisión del evento close
      jest.spyOn(component.close, 'emit');
      // Mockear window.alert para evitar que salte popup real en los tests
      jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    it('debería llamar a guardarRecetaCompleta si no se está editando (receta es null)', () => {
      // Rellenar formulario con datos válidos
      component.recipeForm.get('nombreReceta')?.setValue('Nuevo Cóctel');
      component.recipeForm.get('idCategoria')?.setValue('1');
      component.recipeForm.get('tiempoPreparacion')?.setValue(10);
      component.recipeForm.get('precioUnitario')?.setValue(20000);
      component.recipeForm.get('temperatura')?.setValue('Fría');
      
      component.agregarIngrediente();
      component.ingredientesArr.at(0).get('nombreIngrediente')?.setValue('Limón');
      component.ingredientesArr.at(0).get('cantidadRequerida')?.setValue(10);
      component.ingredientesArr.at(0).get('unidadMedida')?.setValue('ML');

      component.agregarPaso();
      component.pasosArr.at(0).get('descripcionPaso')?.setValue('Servir en vaso');

      expect(component.recipeForm.valid).toBe(true);

      component.guardar();

      // Verificar que se llamó al servicio de guardar de ts-mockito
      verify(mockRecetaService.guardarRecetaCompleta(anything())).once();
      expect(component.close.emit).toHaveBeenCalledWith(true);
    });

    it('debería llamar a actualizarRecetaCompleta si se está editando una receta existente', () => {
      component.receta = mockReceta;
      component.ngOnInit(); // Recargar datos de edición

      expect(component.recipeForm.valid).toBe(true);

      component.guardar();

      // Verificar que se llamó al servicio de actualizar
      verify(mockRecetaService.actualizarRecetaCompleta('RB-100', anything())).once();
      expect(component.close.emit).toHaveBeenCalledWith(true);
    });

    it('debería manejar errores del backend al guardar', () => {
      // Re-mockear la llamada para que devuelva un error
      when(mockRecetaService.guardarRecetaCompleta(anything())).thenReturn(throwError(() => ({
        error: { mensaje: 'Error simulado de base de datos' }
      })));

      // Rellenar formulario
      component.recipeForm.get('nombreReceta')?.setValue('Nuevo Cóctel');
      component.recipeForm.get('idCategoria')?.setValue('1');
      component.recipeForm.get('tiempoPreparacion')?.setValue(10);
      component.recipeForm.get('precioUnitario')?.setValue(20000);
      component.recipeForm.get('temperatura')?.setValue('Fría');
      component.agregarIngrediente();
      component.ingredientesArr.at(0).get('nombreIngrediente')?.setValue('Limón');
      component.agregarPaso();
      component.pasosArr.at(0).get('descripcionPaso')?.setValue('Servir');

      component.guardar();

      verify(mockRecetaService.guardarRecetaCompleta(anything())).once();
      expect(component.isSaving).toBe(false);
      expect(component.close.emit).not.toHaveBeenCalled();
    });
  });

  describe('Acciones de Cancelar', () => {
    it('debería emitir close con false al llamar a cancelar()', () => {
      jest.spyOn(component.close, 'emit');
      component.cancelar();
      expect(component.close.emit).toHaveBeenCalledWith(false);
    });
  });
});
