import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { RubroPresupuestal, GilDocumento, MOCK_RUBROS, MOCK_GIL_DOCUMENTOS } from '../models/presupuesto.model';
import { CargarGilModalComponent } from '../components/cargar-gil-modal/cargar-gil-modal.component';

@Component({
    selector: 'app-presupuesto-detail',
    imports: [CommonModule, RouterModule, LucideIconComponent, CargarGilModalComponent],
    templateUrl: './presupuesto-detail.component.html',
    styleUrl: './presupuesto-detail.component.scss'
})
export class PresupuestoDetailComponent implements OnInit {
  rubro = signal<RubroPresupuestal | undefined>(undefined);
  documentos = signal<GilDocumento[]>(MOCK_GIL_DOCUMENTOS);

  showCargarModal = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const found = MOCK_RUBROS.find(r => r.id === id);
        this.rubro.set(found || MOCK_RUBROS[0]);
      } else {
        this.rubro.set(MOCK_RUBROS[0]); // Fallback
      }
    });
  }

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-CO');
  }

  abrirCargar() {
    this.showCargarModal.set(true);
  }

  cerrarCargar() {
    this.showCargarModal.set(false);
  }

  volver() {
    this.router.navigate(['/presupuesto']);
  }
}
