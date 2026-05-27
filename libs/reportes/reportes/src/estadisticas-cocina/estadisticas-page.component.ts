import { Component, ChangeDetectionStrategy, inject, signal, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComandaService, EstadisticasKpi } from '../../../../cocina/cocina/src/lib/data-access/comanda.service';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

/** Lee un token CSS del :root en tiempo de ejecución */
function cssToken(name: string, fallback = '#888'): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

@Component({
  selector: 'restaurant-estadisticas-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas-page.component.html',
  styleUrl: './estadisticas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticasPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private comandaService = inject(ComandaService);

  kpis = signal<EstadisticasKpi | null>(null);

  @ViewChild('graficoPromedios') graficoPromedios!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoDiario') graficoDiario!: ElementRef<HTMLCanvasElement>;

  private chartPromedios?: any;
  private chartDiario?: any;

  private promediosData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  private diariaData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.comandaService.getKpis().subscribe({
      next: data => this.kpis.set(data),
      error: () => {
        // Fallback para visualización si el backend no expone el endpoint Kpi aún
        this.kpis.set({ promedioDemoraGeneral: 14, platoMasRapido: 'Ensalada César', totalPlatosDespachadosHoy: 45 });
      }
    });

    this.comandaService.getEstadisticasPromedios().subscribe({
      next: data => {
        this.promediosData = {
          labels: data.map(d => d.nombrePlato),
          datasets: [{
            data: data.map(d => d.tiempoPromedioMinutos),
            backgroundColor: cssToken('--color-chart-bar'),
            borderRadius: 4
          }]
        };
        this.renderChartPromedios();
      },
      error: (err) => {
        console.error('Error cargando estadísticas promedios:', err);
      }
    });

    this.comandaService.getEstadisticasDiarias().subscribe({
      next: data => {
        this.diariaData = {
          labels: data.map(d => d.fecha),
          datasets: [{
            data: data.map(d => d.totalPlatosPreparados),
            borderColor: cssToken('--color-chart-line'),
            backgroundColor: cssToken('--color-chart-line-fill', 'rgba(220,165,67,0.2)'),
            fill: true,
            tension: 0.4
          }]
        };
        this.renderChartDiario();
      },
      error: (err) => {
        console.error('Error cargando estadísticas diarias:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.renderChartPromedios();
    this.renderChartDiario();
  }

  ngOnDestroy(): void {
    if (this.chartPromedios) this.chartPromedios.destroy();
    if (this.chartDiario) this.chartDiario.destroy();
  }

  private renderChartPromedios() {
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
            title: { display: true, text: 'Promedio de Demora por Receta (min)' }
          }
        }
      } as any);
    }
  }

  private renderChartDiario() {
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
            title: { display: true, text: 'Volumen de Platos Finalizados (Hoy)' }
          }
        }
      } as any);
    }
  }
}
