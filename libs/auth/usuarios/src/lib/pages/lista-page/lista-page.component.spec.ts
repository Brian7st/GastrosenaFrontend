import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPageComponent } from './lista-page.component';

describe('ListaPageComponent', () => {
  let component: ListaPageComponent;
  let fixture: ComponentFixture<ListaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
