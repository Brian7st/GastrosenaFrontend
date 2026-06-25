import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AlertComponent, LucideIconComponent } from '@restaurant/shared/ui';
import { ConfigSectionComponent } from '../../components/config-section/config-section.component';
import { I18nService } from '../../i18n/i18n.service';
import { ConfiguracionFacade } from '../../data-access/configuracion.facade';
import {
  ConfiguracionApariencia,
  ConfiguracionAvanzado,
} from '../../models/configuracion.model';

@Component({
  selector: 'restaurant-config-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    LucideIconComponent,
    ConfigSectionComponent,
  ],
  templateUrl: './config-page.component.html',
  styleUrl: './config-page.component.scss',
})
export class ConfigPageComponent implements OnInit {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t.bind(this.i18n);

  readonly fuenteOptions = computed<{ value: ConfiguracionApariencia['tamanoFuente']; label: string }[]>(() => [
    { value: 'pequeno', label: this.t('apariencia.small') },
    { value: 'medio', label: this.t('apariencia.medium') },
    { value: 'grande', label: this.t('apariencia.large') },
  ]);

  private readonly facade = inject(ConfiguracionFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly config = this.facade.config;
  readonly loading = this.facade.loading;
  readonly saving = this.facade.saving;
  readonly error = this.facade.error;
  readonly success = this.facade.success;

  readonly expandedSection = signal<string | null>('general');

  // Apariencia (desde facade/localStorage)
  readonly aparienciaForm = signal<ConfiguracionApariencia>(
    this.facade.apariencia(),
  );

  // Avanzado (desde facade/localStorage)
  readonly avanzadoForm = signal<ConfiguracionAvanzado>(
    this.facade.avanzado(),
  );

  ngOnInit(): void {
    this.facade.cargarConfig();
    this.destroyRef.onDestroy(() => {
      this.facade.limpiarMensajes();
    });
  }

  onToggleSection(id: string): void {
    this.expandedSection.update(current =>
      current === id ? null : id,
    );
  }

  // Apariencia
  onAparienciaTema(tema: ConfiguracionApariencia['tema']): void {
    this.aparienciaForm.update(f => ({ ...f, tema }));
  }

  onAparienciaTamanoFuente(tamano: ConfiguracionApariencia['tamanoFuente']): void {
    this.aparienciaForm.update(f => ({ ...f, tamanoFuente: tamano }));
  }

  onSaveApariencia(): void {
    this.facade.actualizarApariencia(this.aparienciaForm());
  }

  // Avanzado
  onAvanzadoIdioma(idioma: ConfiguracionAvanzado['idioma']): void {
    this.avanzadoForm.update(f => ({ ...f, idioma }));
  }

  onSaveAvanzado(): void {
    this.facade.actualizarAvanzado(this.avanzadoForm());
  }
}
