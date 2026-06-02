import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { AlertComponent, LucideIconComponent } from '@restaurant/shared/ui';
import { ConfigSectionComponent } from '../../components/config-section/config-section.component';
import { ConfiguracionFacade } from '../../data-access/configuracion.facade';
import {
  ConfiguracionFacturacion,
  ConfiguracionGeneral,
  ConfiguracionInventario,
  ConfiguracionNotificaciones,
  ConfiguracionSeguridad,
} from '../../models/configuracion.model';
import { MONEDAS, UNIDADES_MEDIDA, ZONAS_HORARIAS } from '../../util';

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
  private readonly facade = inject(ConfiguracionFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly config = this.facade.config;
  readonly loading = this.facade.loading;
  readonly saving = this.facade.saving;
  readonly error = this.facade.error;
  readonly success = this.facade.success;

  readonly zonasHorarias = ZONAS_HORARIAS;
  readonly monedas = MONEDAS;
  readonly unidadesMedida = UNIDADES_MEDIDA;

  readonly expandedSection = signal<string | null>('general');

  // General
  readonly generalForm = signal<ConfiguracionGeneral>({
    nombreRestaurante: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    moneda: 'COP',
    zonaHoraria: 'America/Bogota',
  });

  // Seguridad
  readonly seguridadForm = signal<ConfiguracionSeguridad>({
    longitudMinimaPassword: 8,
    requiereCaracteresEspeciales: true,
    tiempoSesionMinutos: 60,
    intentosMaximosLogin: 5,
    twoFactorAuth: false,
  });

  // Facturación
  readonly facturacionForm = signal<ConfiguracionFacturacion>({
    prefijoFactura: 'FE',
    resolucionDian: '',
    ivaPorcentaje: 19,
    entornoPruebas: true,
  });

  // Inventario
  readonly inventarioForm = signal<ConfiguracionInventario>({
    umbralStockMinimo: 10,
    unidadMedidaDefault: 'Unidad',
  });

  // Notificaciones
  readonly notificacionesForm = signal<ConfiguracionNotificaciones>({
    emailRemitente: '',
    servidorSmtp: '',
    puertoSmtp: 587,
    requiereSsl: true,
  });

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

  onSaveGeneral(): void {
    this.facade.actualizarGeneral(this.generalForm());
  }

  onSaveSeguridad(): void {
    this.facade.actualizarSeguridad(this.seguridadForm());
  }

  onSaveFacturacion(): void {
    this.facade.actualizarFacturacion(this.facturacionForm());
  }

  onSaveInventario(): void {
    this.facade.actualizarInventario(this.inventarioForm());
  }

  onSaveNotificaciones(): void {
    this.facade.actualizarNotificaciones(this.notificacionesForm());
  }

  onGeneralChange(field: keyof ConfiguracionGeneral, value: string): void {
    this.generalForm.update(f => ({ ...f, [field]: value }));
  }

  onSeguridadNumber(field: keyof ConfiguracionSeguridad, value: string): void {
    this.seguridadForm.update(f => ({ ...f, [field]: +value }));
  }

  onSeguridadCheck(field: keyof ConfiguracionSeguridad, checked: boolean): void {
    this.seguridadForm.update(f => ({ ...f, [field]: checked }));
  }

  onFacturacionInput(field: keyof ConfiguracionFacturacion, value: string): void {
    this.facturacionForm.update(f => ({ ...f, [field]: value }));
  }

  onFacturacionNumber(field: keyof ConfiguracionFacturacion, value: string): void {
    this.facturacionForm.update(f => ({ ...f, [field]: +value }));
  }

  onFacturacionCheck(field: keyof ConfiguracionFacturacion, checked: boolean): void {
    this.facturacionForm.update(f => ({ ...f, [field]: checked }));
  }

  onInventarioNumber(field: keyof ConfiguracionInventario, value: string): void {
    this.inventarioForm.update(f => ({ ...f, [field]: +value }));
  }

  onInventarioSelect(field: keyof ConfiguracionInventario, value: string): void {
    this.inventarioForm.update(f => ({ ...f, [field]: value }));
  }

  onNotificacionesInput(field: keyof ConfiguracionNotificaciones, value: string): void {
    this.notificacionesForm.update(f => ({ ...f, [field]: value }));
  }

  onNotificacionesNumber(field: keyof ConfiguracionNotificaciones, value: string): void {
    this.notificacionesForm.update(f => ({ ...f, [field]: +value }));
  }

  onNotificacionesCheck(field: keyof ConfiguracionNotificaciones, checked: boolean): void {
    this.notificacionesForm.update(f => ({ ...f, [field]: checked }));
  }
}
