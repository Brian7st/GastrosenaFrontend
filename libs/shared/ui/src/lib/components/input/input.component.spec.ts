import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { provideRestaurantUi } from '../../providers/restaurant-ui.providers';

describe('InputComponent', () => {
  let fixture: ComponentFixture<InputComponent>;
  let component: InputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
      providers: [provideRestaurantUi()],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the input element', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('emits value on input event', () => {
    const onChange = jasmine.createSpy('onChange');
    component.registerOnChange(onChange);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));

    expect(onChange).toHaveBeenCalledWith('test');
  });

  it('marks as touched on blur', () => {
    const onTouched = jasmine.createSpy('onTouched');
    component.registerOnTouched(onTouched);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('blur'));

    expect(onTouched).toHaveBeenCalled();
  });

  it('shows error message when error input is set', () => {
    fixture.componentRef.setInput('error', 'Campo requerido');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.input-field__error');
    expect(error?.textContent?.trim()).toBe('Campo requerido');
  });

  it('shows hint when no error', () => {
    fixture.componentRef.setInput('hint', 'Ingresá tu correo institucional');
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('.input-field__hint');
    expect(hint?.textContent?.trim()).toBe('Ingresá tu correo institucional');
  });
});
