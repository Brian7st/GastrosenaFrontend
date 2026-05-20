import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../data-access/categoria.service';
import { RecetaService } from '../../data-access/receta.service';
import { IngredienteService } from '../../data-access/ingrediente.service';
import { Receta } from '../../models/receta.model';
import { LucideIconComponent } from '@restaurant/shared/ui';

export function noDuplicatesValidator(fieldName: string): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (!(formArray instanceof FormArray)) return null;
    const values = formArray.controls
      .map(ctrl => ctrl.get(fieldName)?.value?.toString().toLowerCase().trim())
      .filter(v => !!v); // ignore empty
    const hasDuplicates = new Set(values).size !== values.length;
    return hasDuplicates ? { duplicate: true } : null;
  };
}

@Component({
  selector: 'bar-gestion-receta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LucideIconComponent],
  templateUrl: './gestion-receta.component.html',
  styleUrl: './gestion-receta.component.scss'
})
export class GestionRecetaComponent implements OnInit {
  @Input() receta: Receta | null = null;
  @Output() close = new EventEmitter<boolean>(); // true if saved, false if cancelled

  private fb = inject(FormBuilder);
  public catService = inject(CategoriaService);
  public ingService = inject(IngredienteService);
  private recetaService = inject(RecetaService);

  isSaving = false;

  recipeForm = this.fb.group({
    idCategoria: ['', Validators.required],        
    nombreReceta: ['', [Validators.required, Validators.minLength(5)]], 
    tiempoPreparacion: [0, [Validators.required, Validators.min(1)]],   
    precioUnitario: [0, [Validators.required, Validators.min(0)]],    
    temperatura: ['', Validators.required],
    urlImagen: [''],
    ingredientes: this.fb.array([], [Validators.required, noDuplicatesValidator('nombreIngrediente')]),
    pasos: this.fb.array([], [Validators.required, noDuplicatesValidator('descripcionPaso')])
  });

  get ingredientesArr(){
    return this.recipeForm.controls['ingredientes'] as FormArray;
  }

  get pasosArr() {
    return this.recipeForm.controls['pasos'] as FormArray;
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.recipeForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  ngOnInit(){
    this.catService.listar();
    this.ingService.listarIngredientes();
    
    if (this.receta) {
      this.cargarDatosParaEdicion(this.receta);
    }
  }

  private cargarDatosParaEdicion(receta: Receta) {
    this.recipeForm.patchValue({
      idCategoria: receta.idCategoria || '',
      nombreReceta: receta.nombreReceta,
      tiempoPreparacion: receta.tiempoPreparacion,
      precioUnitario: receta.precioUnitario,
      temperatura: receta.temperatura,
      urlImagen: receta.urlImagen || ''
    });

    if (receta.ingredientes) {
      receta.ingredientes.forEach((ing: any) => {
        const group = this.fb.group({
          nombreIngrediente: [ing.nombreIngrediente || ing.nombre, [Validators.required, Validators.minLength(2)]],
          cantidadRequerida: [ing.cantidadRequerida, [Validators.required, Validators.min(0.1)]],
          unidadMedida: [ing.unidadMedida, Validators.required]
        });
        this.ingredientesArr.push(group);
      });
    }

    if (receta.pasos) {
      receta.pasos.forEach((paso: any) => {
        const group = this.fb.group({
          orden: [paso.orden],
          descripcionPaso: [paso.descripcionPaso, Validators.required],
          notesAdicionales: [paso.notasAdicionales || ''] // keep compatibility
        });
        this.pasosArr.push(group);
      });
    }
  }

  agregarIngrediente() {
    if (this.ingredientesArr.hasError('duplicate')) {
      alert('Por favor corrige los ingredientes duplicados antes de agregar uno nuevo.');
      return;
    }
    const lastCtrl = this.ingredientesArr.controls[this.ingredientesArr.length - 1];
    if (lastCtrl && !lastCtrl.get('nombreIngrediente')?.value?.trim()) {
      alert('Debes completar el nombre del ingrediente actual antes de agregar otro.');
      return;
    }

    const nuevoIngrediente = this.fb.group({
      nombreIngrediente: ['', [Validators.required, Validators.minLength(2)]], 
      cantidadRequerida: [1, [Validators.required, Validators.min(0.1)]],      
      unidadMedida: ['GR', Validators.required]                             
    });
    this.ingredientesArr.push(nuevoIngrediente);
  }

  removerIngrediente(index: number) {
    this.ingredientesArr.removeAt(index);
  }

  agregarPaso() {
    if (this.pasosArr.hasError('duplicate')) {
      alert('Por favor corrige los pasos repetidos antes de agregar uno nuevo.');
      return;
    }
    const lastCtrl = this.pasosArr.controls[this.pasosArr.length - 1];
    if (lastCtrl && !lastCtrl.get('descripcionPaso')?.value?.trim()) {
      alert('Debes completar la descripción del paso actual antes de agregar otro.');
      return;
    }

    const orden = this.pasosArr.length + 1;
    const group = this.fb.group({
      orden: [orden],
      descripcionPaso: ['', Validators.required],
      notasAdicionales: ['']
    });
    this.pasosArr.push(group);
  }

  removerPaso(index: number) {
    this.pasosArr.removeAt(index);
    this.pasosArr.controls.forEach((control, i) => {
      control.get('orden')?.setValue(i + 1);
    });
  }

  cancelar() {
    this.close.emit(false);
  }

  guardar() {
    if (this.recipeForm.valid) {
      this.isSaving = true;
      
      const formValue = this.recipeForm.value as any;
      
      // Adapt notesAdicionales mapping
      if (formValue.pasos) {
        formValue.pasos = formValue.pasos.map((p: any) => ({
          orden: p.orden,
          descripcionPaso: p.descripcionPaso,
          notasAdicionales: p.notesAdicionales || p.notasAdicionales || ''
        }));
      }
      
      const observable = this.receta?.idReceta 
        ? this.recetaService.actualizarRecetaCompleta(this.receta.idReceta, formValue)
        : this.recetaService.guardarRecetaCompleta(formValue);

      observable.subscribe({
        next: () => {
          alert(this.receta ? '¡Receta actualizada con éxito!' : '¡Receta guardada con éxito!');
          this.close.emit(true);
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          let errorMsg = 'Error al guardar. Verifica la conexión con el backend.';
          if (err.error) {
            if (typeof err.error === 'string') {
               errorMsg = err.error;
            } else if (err.error.mensaje) {
               errorMsg = err.error.mensaje;
            } else {
               errorMsg = JSON.stringify(err.error, null, 2);
            }
          }
          alert('Error del Servidor:\n' + errorMsg);
          this.isSaving = false;
        }
      });
    } else {
      this.recipeForm.markAllAsTouched();
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.recipeForm.patchValue({ urlImagen: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }
}
