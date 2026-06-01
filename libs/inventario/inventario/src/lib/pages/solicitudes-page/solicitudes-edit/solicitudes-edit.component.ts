import {
  Component,
  ChangeDetectionStrategy,
  computed,
  signal,
  inject,
  OnInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { BienSolicitud, ActualizarSolicitudData } from '../../../models/solicitudes-gil.model';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';

@Component({
  selector: 'restaurant-solicitudes-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, BackButtonComponent],
  templateUrl: './solicitudes-edit.component.html',
  styleUrl: './solicitudes-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesEditComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private facade = inject(SolicitudesFacade);

  // ── Estado del facade ─────────────────────────────────────────────────────
  solicitud   = this.facade.solicitudSeleccionada;
  loading     = this.facade.loading;
  facadeError = this.facade.error;
  solicitudId = computed(() => this.solicitud()?.numeroGil ?? '');

  isBlocked = computed(() => {
    const estado = this.solicitud()?.estado;
    return estado !== undefined && estado !== 'BORRADOR';
  });

  // ── Estado local ──────────────────────────────────────────────────────────
  isSaving    = signal(false);
  feedbackMsg = signal<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  totalValor  = computed(() => this.bienes().reduce((acc, b) => acc + b.subtotal, 0));

  // ── Campos del formulario ─────────────────────────────────────────────────
  fechaSolicitud         = signal('');
  regionalCodigo         = signal<number | null>(null);
  regionalNombre         = signal('');
  centroCostosCodigo     = signal<number | null>(null);
  centroCostosNombre     = signal('');
  area                   = signal('');
  destinoBienes          = signal('FORMACION');
  jefeOficinaCoordinador = signal('');
  solicitante            = signal('');
  codigoGrupo            = signal('');
  observaciones          = signal('');
  cuentadantes           = signal<{ nombre: string; cedula: string }[]>([]);
  bienes                 = signal<BienSolicitud[]>([]);

  // ── Opciones de dominio ───────────────────────────────────────────────────
  readonly AREAS = ['Centro de Comercio y Turismo', 'Escuela de Gastronomía'];
  readonly DESTINOS = [
    { value: 'FORMACION',   label: 'Formación'    },
    { value: 'LABORATORIO', label: 'Laboratorio'  },
    { value: 'AULA',        label: 'Aula'         },
    { value: 'OTRO',        label: 'Otro'         },
  ];

  // ── Poblar formulario cuando el GIL carga (solo la primera vez) ───────────
  private _populated = false;
  private readonly _populateEffect = effect(() => {
    const s = this.solicitud();
    if (!s || this._populated) return;
    this._populated = true;
    this.fechaSolicitud.set(s.fechaSolicitud ?? '');
    this.regionalCodigo.set(s.regionalCodigo ?? null);
    this.regionalNombre.set(s.regionalNombre ?? '');
    this.centroCostosCodigo.set(s.centroCostosCodigo ?? null);
    this.centroCostosNombre.set(s.centroCostosNombre ?? '');
    this.area.set(s.area ?? '');
    this.destinoBienes.set(s.destinoBienes ?? 'FORMACION');
    this.jefeOficinaCoordinador.set(s.jefeOficinaCoordinador ?? '');
    this.solicitante.set(s.solicitante ?? '');
    this.codigoGrupo.set(s.codigoGrupo ?? '');
    this.observaciones.set(s.observaciones ?? '');
    this.cuentadantes.set(
      (s.cuentadantes ?? []).map(c => ({ nombre: c.nombre, cedula: c.cedula ?? '' }))
    );
    this.bienes.set(s.bienes ?? []);
  });

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.facade.cargarSolicitudById(paramId);
    }
  }

  onCancel(): void {
    const rawId = this.route.snapshot.paramMap.get('id') || '001';
    this.router.navigate(['/app/inventario/solicitudes-gil', rawId]);
  }

  onSave(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isSaving.set(true);
    this.feedbackMsg.set(null);

    const payload: ActualizarSolicitudData = {
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
      bienes:                 this.bienes(),
      observaciones:          this.observaciones() || undefined,
    };

    this.facade.actualizarSolicitud(id, payload).subscribe({
      next: (ok: boolean) => {
        this.isSaving.set(false);
        if (ok) {
          this.feedbackMsg.set({ tipo: 'success', texto: 'GIL actualizado correctamente' });
          setTimeout(() => this.router.navigate(['/app/inventario/solicitudes-gil', id]), 800);
        } else {
          this.feedbackMsg.set({
            tipo: 'error',
            texto: this.facadeError() ?? 'Error al guardar los cambios',
          });
        }
      },
    });
  }

  onRemoveCuentadante(index: number): void {
    this.cuentadantes.update(list => list.filter((_, i) => i !== index));
  }

  onRemoveBien(index: number): void {
    this.bienes.update(items => items.filter((_, i) => i !== index));
  }
}
