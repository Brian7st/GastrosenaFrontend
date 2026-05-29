import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  signal,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { timeout } from 'rxjs';
import { ComandaService, EstadisticasKpi } from '../../data-access/comanda.service';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import {
  LucideIconComponent,
  PageHeaderComponent
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-bar-estadisticas-page',
  standalone: true,
  imports: [CommonModule, LucideIconComponent, PageHeaderComponent],
  templateUrl: './estadisticas-page.component.html',
  styleUrl: './estadisticas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticasPageComponent implements OnInit, OnDestroy {
  private comandaService = inject(ComandaService);
  private cdr = inject(ChangeDetectorRef);

  kpis = signal<EstadisticasKpi | null>(null);
  cargandoKpis = signal(true);
  errorKpis = signal(false);
  cargandoGraficos = signal(true);

  @ViewChild('graficoPromedios') graficoPromedios!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoDiario') graficoDiario!: ElementRef<HTMLCanvasElement>;

  private chartPromedios?: Chart<'bar'>;
  private chartDiario?: Chart<'line'>;

  private promediosData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  private diariaData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  private graficosListos = { promedios: false, diaria: false };

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.cargarKpis();
    this.cargarGraficos();
  }

  private cargarKpis(): void {
    this.cargandoKpis.set(true);
    this.errorKpis.set(false);

    this.comandaService.getKpis().pipe(timeout(2500)).subscribe({
      next: data => {
        if (data && typeof data === 'object') {
          this.kpis.set(data);
        }
        this.cargandoKpis.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.kpis.set(null);
        this.errorKpis.set(true);
        this.cargandoKpis.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  private cargarGraficos(): void {
    this.cargandoGraficos.set(true);
    this.graficosListos.promedios = false;
    this.graficosListos.diaria = false;

    this.comandaService.getEstadisticasPromedios().pipe(timeout(2500)).subscribe({
      next: data => {
        if (Array.isArray(data) && data.length > 0) {
          this.promediosData = {
            labels: data.map(d => d.nombreReceta),
            datasets: [{
              data: data.map(d => d.promedioMinutos),
              backgroundColor: '#0ea5e9',
              borderRadius: 4
            }]
          };
        } else {
          this.promediosData = { labels: [], datasets: [] };
        }
        this.graficosListos.promedios = true;
        this.verificarGraficosCompletos();
      },
      error: () => {
        console.error('Error al cargar estadísticas de promedios.');
        this.promediosData = { labels: [], datasets: [] };
        this.graficosListos.promedios = true;
        this.verificarGraficosCompletos();
      }
    });

    this.comandaService.getEstadisticasDiarias().pipe(timeout(2500)).subscribe({
      next: data => {
        if (Array.isArray(data) && data.length > 0) {
          this.diariaData = {
            labels: data.map(d => d.hora),
            datasets: [{
              data: data.map(d => d.totalBebidas),
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              fill: true,
              tension: 0.4
            }]
          };
        } else {
          this.diariaData = { labels: [], datasets: [] };
        }
        this.graficosListos.diaria = true;
        this.verificarGraficosCompletos();
      },
      error: () => {
        console.error('Error al cargar estadísticas diarias.');
        this.diariaData = { labels: [], datasets: [] };
        this.graficosListos.diaria = true;
        this.verificarGraficosCompletos();
      }
    });
  }

  private verificarGraficosCompletos(): void {
    if (this.graficosListos.promedios && this.graficosListos.diaria) {
      this.cargandoGraficos.set(false);
      this.cdr.markForCheck();

      // Renderizar los gráficos después de que se actualice la vista y los canvas sean visibles en el DOM
      setTimeout(() => {
        this.renderChartPromedios();
        this.renderChartDiario();
      }, 50);
    }
  }

  ngOnDestroy(): void {
    if (this.chartPromedios) this.chartPromedios.destroy();
    if (this.chartDiario) this.chartDiario.destroy();
  }

  private renderChartPromedios(): void {
    if (!this.graficoPromedios?.nativeElement || this.promediosData.labels?.length === 0) return;

    if (this.chartPromedios) {
      this.chartPromedios.data = this.promediosData;
      this.chartPromedios.update();
    } else {
      this.chartPromedios = new Chart(this.graficoPromedios.nativeElement, {
        type: 'bar',
        data: this.promediosData,
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Promedio de Demora por Bebida (min)' }
          }
        }
      });
    }
  }

  private renderChartDiario(): void {
    if (!this.graficoDiario?.nativeElement || this.diariaData.labels?.length === 0) return;

    if (this.chartDiario) {
      this.chartDiario.data = this.diariaData;
      this.chartDiario.update();
    } else {
      this.chartDiario = new Chart(this.graficoDiario.nativeElement, {
        type: 'line',
        data: this.diariaData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Volumen de Bebidas Finalizadas (Hoy)' }
          }
        }
      });
    }
  }
}
