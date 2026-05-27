import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

interface BienInsumo {
  nombre: string;
  cantidad: number;
  unidad: string;
}

@Component({
  selector: 'restaurant-solicitudes-insumos-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, BackButtonComponent],
  templateUrl: './solicitudes-insumos-form.component.html',
  styleUrl: './solicitudes-insumos-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesInsumosFormComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = signal(false);
  solicitudId = signal<string | null>(null);
  solicitudCodigo = signal<string | null>(null);

  // ── Estado Reactivo Formulario ──────────────────────────────────────────
  instructor    = signal('Chef Sebastian Betancourt');
  fecha         = signal('12/10/2026');
  ambiente      = signal('Cocina Laboratorio A');
  ficha         = signal('2560892');
  observaciones = signal('');

  bienes = signal<BienInsumo[]>([
    { nombre: 'Harina de Trigo', cantidad: 10, unidad: 'kg' }
  ]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.solicitudId.set(id);
      
      if (id === '6') {
        this.solicitudCodigo.set('SOL-2024-006');
        this.instructor.set('Chef Sebastian Betancourt');
        this.fecha.set('15 Oct');
        this.ambiente.set('Cocina Panadería B');
        this.ficha.set('2560892');
        this.observaciones.set('Solicitud en borrador para insumos de panadería de la Ficha 2560892.');
        this.bienes.set([
          { nombre: 'Harina de Trigo', cantidad: 10, unidad: 'kg' }
        ]);
      } else if (id === '7') {
        this.solicitudCodigo.set('SOL-2024-007');
        this.instructor.set('Lic. Martha Lucía Peña');
        this.fecha.set('16 Oct');
        this.ambiente.set('Aula de Bar y Coctelería');
        this.ficha.set('2339810');
        this.observaciones.set('Material de cristalería e insumos de coctelería clásica para taller evaluativo.');
        this.bienes.set([
          { nombre: 'Jarabe de Goma', cantidad: 4, unidad: 'botellas' },
          { nombre: 'Limón Tahití', cantidad: 5, unidad: 'kg' },
          { nombre: 'Hielo en cubos', cantidad: 3, unidad: 'bolsas' }
        ]);
      }
    } else {
      // Valores por defecto para Nueva Solicitud
      this.instructor.set('Chef Sebastian Betancourt');
      this.fecha.set('12/10/2026');
      this.ambiente.set('Cocina Laboratorio A');
      this.ficha.set('2560892');
      this.observaciones.set('');
      this.bienes.set([
        { nombre: 'Harina de Trigo', cantidad: 10, unidad: 'kg' }
      ]);
    }
  }

  onCancel(): void {
    this.router.navigate(['/app/inventario/solicitudes-insumos-page']);
  }

  onSave(): void {
    // Aquí se guardaría el borrador o se enviaría la solicitud
    this.router.navigate(['/app/inventario/solicitudes-insumos-page']);
  }

  onAddBien(): void {
    this.bienes.update(items => [
      ...items,
      { nombre: '', cantidad: 1, unidad: 'kg' }
    ]);
  }

  onRemoveBien(index: number): void {
    this.bienes.update(items => items.filter((_, i) => i !== index));
  }
}
