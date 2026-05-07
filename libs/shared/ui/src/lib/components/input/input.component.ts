import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'restaurant-input',
  standalone: true,
  imports: [LucideIconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  label       = input<string>('');
  placeholder = input<string>('');
  type        = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url'>('text');
  disabled    = input<boolean>(false);
  readonly    = input<boolean>(false);
  required    = input<boolean>(false);
  error       = input<string | null>(null);
  hint        = input<string | null>(null);
  icon        = input<string | null>(null);
  iconPosition = input<'left' | 'right'>('left');

  readonly value = signal<string>('');

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }
}
