import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComandasPageComponent } from './comandas-page.component';

describe('ComandasPageComponent', () => {
  let component: ComandasPageComponent;
  let fixture: ComponentFixture<ComandasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComandasPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ComandasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Filtros de búsqueda', () => {
    it('debería filtrar por el término de búsqueda (mesa o mesero)', () => {
      // Buscar por nombre de mesero
      component.searchTerm.set('María');
      fixture.detectChanges();
      let filtradas = component.comandasFiltradas();
      expect(filtradas.length).toBe(1);
      expect(filtradas[0].mesero).toBe('María G.');

      // Buscar por mesa
      component.searchTerm.set('Mesa 2');
      fixture.detectChanges();
      filtradas = component.comandasFiltradas();
      expect(filtradas.length).toBe(1);
      expect(filtradas[0].mesa).toBe('Mesa 2');

      // Limpiar búsqueda
      component.searchTerm.set('');
      fixture.detectChanges();
      expect(component.comandasFiltradas().length).toBe(4);
    });

    it('debería filtrar por estado', () => {
      component.filtroEstado.set('Preparando');
      fixture.detectChanges();
      const filtradas = component.comandasFiltradas();
      
      expect(filtradas.length).toBe(1);
      expect(filtradas[0].estado).toBe('Preparando');
    });

    it('debería filtrar por prioridad', () => {
      component.filtroPrioridad.set('Alta');
      fixture.detectChanges();
      const filtradas = component.comandasFiltradas();
      
      expect(filtradas.length).toBe(1);
      expect(filtradas[0].prioridad).toBe('Alta');
    });
  });

  describe('Ordenamiento', () => {
    it('debería ordenar por Prioridad correctamente (Urgente > Alta > Normal)', () => {
      component.filtroOrden.set('Prioridad');
      fixture.detectChanges();
      const filtradas = component.comandasFiltradas();
      
      // Comprobamos el orden descendente de prioridad
      expect(filtradas[0].prioridad).toBe('Urgente');
      expect(filtradas[1].prioridad).toBe('Alta');
      expect(filtradas[2].prioridad).toBe('Normal');
    });

    it('debería ordenar por Hora de llegada correctamente', () => {
      component.filtroOrden.set('Hora de llegada');
      fixture.detectChanges();
      const filtradas = component.comandasFiltradas();
      
      // Orden ascendente de horas de string ('22:15', '22:30', '22:35', '22:40')
      expect(filtradas[0].hora).toBe('22:15');
      expect(filtradas[1].hora).toBe('22:30');
      expect(filtradas[2].hora).toBe('22:35');
      expect(filtradas[3].hora).toBe('22:40');
    });

    it('debería ordenar por Tiempo estimado correctamente', () => {
      component.filtroOrden.set('Tiempo estimado');
      fixture.detectChanges();
      const filtradas = component.comandasFiltradas();
      
      // Tiempos ascendentes: 8, 10, 15, 25
      expect(filtradas[0].tiempo).toBe(8);
      expect(filtradas[1].tiempo).toBe(10);
      expect(filtradas[2].tiempo).toBe(15);
      expect(filtradas[3].tiempo).toBe(25);
    });
  });

  describe('Propiedades Computadas (Señales)', () => {
    it('debería agrupar correctamente las comandas por su estado (En Espera, Preparando, Listo)', () => {
      expect(component.enEspera().length).toBe(2);
      expect(component.preparando().length).toBe(1);
      expect(component.listos().length).toBe(1);
    });
  });

  describe('Gestión de Estado', () => {
    it('debería actualizar el estado de una comanda usando cambiarEstado', () => {
      const comandaEnEspera = component.comandas().find(c => c.estado === 'En Espera')!;
      
      // Simulamos cambiar estado de 'En Espera' a 'Preparando'
      component.cambiarEstado(comandaEnEspera, 'Preparando');
      fixture.detectChanges();
      
      const updatedComandas = component.comandas();
      const modifiedComanda = updatedComandas.find(c => c.id === comandaEnEspera.id);
      
      expect(modifiedComanda?.estado).toBe('Preparando');
      
      // El cambio de estado debe reflejarse en los selectores computados
      expect(component.enEspera().length).toBe(1);
      expect(component.preparando().length).toBe(2);
    });
  });
});
