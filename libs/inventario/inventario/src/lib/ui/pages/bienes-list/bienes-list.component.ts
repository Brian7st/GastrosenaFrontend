import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  PageHeaderComponent, 
  SearchFilterComponent, 
  SelectFilterComponent,
  LoadingSkeletonComponent
} from '@restaurant/shared/ui';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { BienKpiCardsComponent } from '../../components/bien-kpi-cards/bien-kpi-cards.component';
import { BienTableComponent } from '../../components/bien-table/bien-table.component';
import { Bien } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-bienes-list',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    SearchFilterComponent,
    SelectFilterComponent,
    LoadingSkeletonComponent,
    BienKpiCardsComponent,
    BienTableComponent
  ],
  templateUrl: './bienes-list.component.html',
  styleUrl: './bienes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienesListPageComponent implements OnInit {
  private facade = inject(InventarioFacade);

  // Seleccionamos los estados desde el facade (Signals)
  bienes = this.facade.bienes;
  kpis = this.facade.kpis;
  loading = this.facade.loading;
  filtros = this.facade.filtros;

  ngOnInit(): void {
    this.facade.loadAll();
  }

  onSearch(query: string): void {
    this.facade.setFiltros({ busqueda: query });
  }

  onFilterCategory(category: string): void {
    this.facade.setFiltros({ categoria: category });
  }

  onNuevoBien(): void {
    console.log('Abrir modal de nuevo bien');
  }

  onEditar(bien: Bien): void {
    console.log('Editar bien:', bien);
  }

  onVerDetalle(bien: Bien): void {
    console.log('Ver detalle bien:', bien);
  }

  onEliminar(bien: Bien): void {
    if (confirm(`¿Estás seguro de eliminar el bien ${bien.nombre}?`)) {
      this.facade.eliminarBien(bien.id);
    }
  }
}
