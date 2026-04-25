import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComandasTablaComponent } from './comandas-tabla.component';

describe('ComandasTablaComponent', () => {
  let component: ComandasTablaComponent;
  let fixture: ComponentFixture<ComandasTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComandasTablaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComandasTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
