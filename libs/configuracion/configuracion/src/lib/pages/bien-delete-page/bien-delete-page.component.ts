import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  LucideIconComponent,
} from '@restaurant/shared/ui';
import { BienLimpiezaFacade } from '../../data-access/bien-limpieza.facade';
import { BienInactivo, MotivoOmision } from '../../models/bien-limpieza.model';

@Component({
  selector: 'restaurant-bien-delete-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    LucideIconComponent,
  ],
  templateUrl: './bien-delete-page.component.html',
  styleUrl: './bien-delete-page.component.scss',
})
export class BienDeletePageComponent implements OnInit {
  private readonly facade = inject(BienLimpiezaFacade);

  readonly loading = this.facade.loading;
  readonly error = this.facade.error;
  readonly resultado = this.facade.resultado;

  readonly busqueda = signal('');
  readonly showConfirm = signal(false);
  readonly confirmacionInput = signal('');
  readonly showResultado = signal(false);

  readonly bienes = computed(() => this.facade.inactivos());

  readonly bienesFiltrados = computed(() => {
    const lista = this.bienes();
    const q = this.busqueda().toLowerCase();
    if (!q) return lista;
    return lista.filter(
      (b: BienInactivo) =>
        b.descripcion.toLowerCase().includes(q) ||
        (b.codigoSena ?? '').toLowerCase().includes(q),
    );
  });

  readonly confirmacionValida = computed(
    () => this.confirmacionInput().trim() === 'LIMPIAR',
  );

  readonly motivosOmision = computed(
    (): MotivoOmision[] => this.resultado()?.motivosOmision ?? [],
  );

  ngOnInit(): void {
    this.facade.cargarInactivos();
  }

  onOpenConfirm(): void {
    this.confirmacionInput.set('');
    this.showConfirm.set(true);
    this.facade.limpiarResultado();
    this.showResultado.set(false);
  }

  onCancelDelete(): void {
    this.showConfirm.set(false);
    this.confirmacionInput.set('');
  }

  onConfirmDelete(): void {
    if (!this.confirmacionValida()) return;
    this.showConfirm.set(false);
    this.confirmacionInput.set('');
    this.facade.ejecutarLimpieza();
    this.showResultado.set(true);
  }
}
