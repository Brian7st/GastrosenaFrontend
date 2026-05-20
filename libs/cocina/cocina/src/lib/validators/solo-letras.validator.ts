import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function soloLetrasValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    // Permite letras (incluyendo acentos y ñ) y espacios. No números.
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const valid = regex.test(control.value);
    return valid ? null : { soloLetras: true };
  };
}
