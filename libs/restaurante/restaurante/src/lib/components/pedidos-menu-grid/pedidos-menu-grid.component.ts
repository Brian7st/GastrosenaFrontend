import { ChangeDetectionStrategy, Component, inject, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { ProductoMenu } from '../../data-access/restaurante.facade';

import { CardComponent, ConfirmDialogComponent } from '@restaurant/shared/ui';
import { CurrencyCopPipe } from '@restaurant/shared/util';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'lib-pedidos-menu-grid',
  standalone: true,
  imports: [CommonModule, CardComponent, ConfirmDialogComponent, CurrencyCopPipe],
  templateUrl: './pedidos-menu-grid.component.html',
  styleUrls: ['./pedidos-menu-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosMenuGridComponent {
  @Input() set searchTerm(val: string) {
    this._searchTerm = val.toLowerCase();
  }
  private _searchTerm = '';
  @Input() mainCategory: string = 'all';
  @Input() subCategory: string = 'all';

  protected readonly i18n = inject(I18nService);
  private facade = inject(RestauranteFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public showNoTableModal = signal(false);

  get products() {
    let filtered = this.facade.productosMenu();

    if (this.mainCategory !== 'all') {
      filtered = filtered.filter(p => {
        const isBeb = !!(p.categoryName || '').toLowerCase().match(/bebida|jugo|licor|café|cafe|alcohol|alcholica|coctel|cóctel/);
        return this.mainCategory === 'BEBIDA' ? isBeb : !isBeb;
      });
    }

    if (this.subCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.subCategory);
    }

    if (this._searchTerm) {
      filtered = filtered.filter(p => p.name?.toLowerCase().includes(this._searchTerm));
    }

    return filtered;
  }

  agregarProducto(product: any) {
    if (!this.facade.pedidoActivo()) {
      this.showNoTableModal.set(true);
      return;
    }

    const nombreCat = (product.categoryName || '').toLowerCase();
    const isBebida = nombreCat.includes('bebida') || 
                     nombreCat.includes('jugo') || 
                     nombreCat.includes('licor') || 
                     nombreCat.includes('café') || 
                     nombreCat.includes('cafe') || 
                     nombreCat.includes('alcohol') || 
                     nombreCat.includes('alcholica') || 
                     nombreCat.includes('coctel') || 
                     nombreCat.includes('cóctel');
    const categoriaMapped = isBebida ? 'BEBIDA' : 'COMIDA';

    this.facade.agregarProductoAlPedido(
      product.id,
      product.name,
      product.price,
      categoriaMapped,
      ''
    );
  }

  irAMesas() {
    this.showNoTableModal.set(false);
    this.router.navigate(['../mesas'], { relativeTo: this.route });
  }
}

