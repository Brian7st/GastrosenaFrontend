import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComandasFiltrosComponent } from './comandas-filtros.component';

describe('ComandasFiltrosComponent', () => {
  let component: ComandasFiltrosComponent;
  let fixture: ComponentFixture<ComandasFiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComandasFiltrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComandasFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
