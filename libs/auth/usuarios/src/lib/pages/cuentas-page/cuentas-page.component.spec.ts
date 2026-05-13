import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentasPageComponent } from './cuentas-page.component';

describe('CuentasPageComponent', () => {
  let component: CuentasPageComponent;
  let fixture: ComponentFixture<CuentasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentasPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CuentasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
