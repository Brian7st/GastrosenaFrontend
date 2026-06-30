import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActasFacade } from '../../../data-access/actas.facade';
import { ActaDocumentoComponent } from '../../../components/acta-documento/acta-documento.component';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-actas-print',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActaDocumentoComponent],
  templateUrl: './actas-print.component.html',
  styleUrl: './actas-print.component.scss',
})
export class ActasPrintComponent implements OnInit {
  private route = inject(ActivatedRoute);
  protected readonly i18n = inject(I18nService);
  private router = inject(Router);
  private facade = inject(ActasFacade);

  acta = this.facade.actaSeleccionada;
  loading = this.facade.loading;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarActa(id);
    } else {
      this.router.navigate(['/app/inventario/actas']);
    }
  }

  imprimir(): void {
    window.print();
  }

  /** Descarga el PDF oficial del acta generado por ga-ms-reportes. */
  exportarPdf(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.exportarActaPdf(id);
    }
  }

  volver(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/app/inventario/actas', id]);
  }
}
