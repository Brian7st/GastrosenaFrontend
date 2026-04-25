import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComandasPageComponent } from './comandas-page.component';

describe('ComandasPageComponent', () => {
  let component: ComandasPageComponent;
  let fixture: ComponentFixture<ComandasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComandasPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComandasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
