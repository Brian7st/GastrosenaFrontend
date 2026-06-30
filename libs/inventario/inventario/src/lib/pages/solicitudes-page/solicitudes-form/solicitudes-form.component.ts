import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';
import { GIL_DEFAULTS } from '../../../util/gil-defaults.config';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-solicitudes-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, BackButtonComponent],
  templateUrl: './solicitudes-form.component.html',
  styleUrl: './solicitudes-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesFormComponent implements OnInit {
  private router = inject(Router);
  private facade = inject(SolicitudesFacade);
  protected readonly i18n = inject(I18nService);

  readonly AREAS = ['Centro de Comercio y Turismo', 'Escuela de Gastronomía'];
  readonly DESTINOS = computed(() => [
    { value: 'FORMACION',   label: this.i18n.t('solicitudes-form.destino_formacion') },
    { value: 'LABORATORIO', label: this.i18n.t('solicitudes-form.destino_laboratorio') },
    { value: 'AULA',        label: this.i18n.t('solicitudes-form.destino_aula') },
    { value: 'OTRO',        label: this.i18n.t('solicitudes-form.destino_otro') },
  ]);

  loading = this.facade.loading;

  fechaSolicitud          = signal(new Date().toISOString().split('T')[0]);
  regionalCodigo          = signal<number | null>(GIL_DEFAULTS.regionalCodigo);
  regionalNombre          = signal(GIL_DEFAULTS.regionalNombre);
  centroCostosCodigo      = signal<number | null>(GIL_DEFAULTS.centroCostosCodigo);
  centroCostosNombre      = signal(GIL_DEFAULTS.centroCostosNombre);
  area                    = signal(GIL_DEFAULTS.area);
  destinoBienes           = signal('FORMACION');
  jefeOficinaCoordinador  = signal('');
  solicitante             = signal('');
  codigoGrupo             = signal('');
  observaciones           = signal('');

  cuentadantes        = signal<{ nombre: string; cedula: string }[]>([]);
  mostrarNuevaCuenta  = signal(false);
  nuevaCuenta         = signal('');
  nuevaCuentaCedula   = signal('');

  submitAttempted = signal(false);

  errores = computed<Record<string, string>>(() => {
    const e: Record<string, string> = {};
    if (!this.fechaSolicitud().trim())
      e['fechaSolicitud'] = this.i18n.t('solicitudes-form.error_fecha');
    if (this.regionalCodigo() === null)
      e['regionalCodigo'] = this.i18n.t('solicitudes-form.error_regional_codigo');
    if (!this.regionalNombre().trim())
      e['regionalNombre'] = this.i18n.t('solicitudes-form.error_regional_nombre');
    if (this.centroCostosCodigo() === null)
      e['centroCostosCodigo'] = this.i18n.t('solicitudes-form.error_centro_costos_codigo');
    if (!this.centroCostosNombre().trim())
      e['centroCostosNombre'] = this.i18n.t('solicitudes-form.error_centro_costos_nombre');
    if (!this.area().trim())
      e['area'] = this.i18n.t('solicitudes-form.error_area');
    if (!this.destinoBienes().trim())
      e['destinoBienes'] = this.i18n.t('solicitudes-form.error_destino_bienes');
    if (!this.jefeOficinaCoordinador().trim())
      e['jefeOficinaCoordinador'] = this.i18n.t('solicitudes-form.error_jefe_oficina');
    if (!this.solicitante().trim())
      e['solicitante'] = this.i18n.t('solicitudes-form.error_solicitante');
    if (this.codigoGrupo().trim() && !/^\d+$/.test(this.codigoGrupo().trim()))
      e['codigoGrupo'] = this.i18n.t('solicitudes-form.error_codigo_grupo');
    if (this.cuentadantes().length === 0)
      e['cuentadantes'] = this.i18n.t('solicitudes-form.error_cuentadantes');
    return e;
  });

  formularioValido = computed(() => Object.keys(this.errores()).length === 0);

  ngOnInit(): void {
    this.facade.loadAll();
    this.facade.limpiarSolicitudSeleccionada();
  }

  onAddCuentadante(): void {
    this.mostrarNuevaCuenta.update(v => !v);
    if (!this.mostrarNuevaCuenta()) {
      this.nuevaCuenta.set('');
      this.nuevaCuentaCedula.set('');
    }
  }

  onConfirmarCuentadante(): void {
    const nombre = this.nuevaCuenta().trim();
    const cedula = this.nuevaCuentaCedula().trim();
    if (!nombre || !cedula) return;
    this.cuentadantes.update(list => [...list, { nombre, cedula }]);
    this.mostrarNuevaCuenta.set(false);
    this.nuevaCuenta.set('');
    this.nuevaCuentaCedula.set('');
  }

  onRemoveCuentadante(index: number): void {
    this.cuentadantes.update(list => list.filter((_, i) => i !== index));
  }

  onCancel(): void {
    this.router.navigate(['/app/inventario/solicitudes-gil']);
  }

  onSave(): void {
    this.submitAttempted.set(true);
    if (!this.formularioValido()) return;

    this.facade.crearSolicitud({
      fechaSolicitud:         this.fechaSolicitud(),
      regionalCodigo:         this.regionalCodigo()!,
      regionalNombre:         this.regionalNombre(),
      centroCostosCodigo:     this.centroCostosCodigo()!,
      centroCostosNombre:     this.centroCostosNombre(),
      area:                   this.area(),
      destinoBienes:          this.destinoBienes(),
      jefeOficinaCoordinador: this.jefeOficinaCoordinador(),
      cuentadantes:           this.cuentadantes(),
      solicitante:            this.solicitante(),
      codigoGrupo:            this.codigoGrupo() || undefined,
      bienes:                 [],
      observaciones:          this.observaciones() || undefined,
    }).subscribe(ok => {
      if (ok) this.router.navigate(['/app/inventario/solicitudes-gil']);
    });
  }
}
