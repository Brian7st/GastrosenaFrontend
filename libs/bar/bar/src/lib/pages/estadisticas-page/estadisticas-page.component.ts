import { Component, ChangeDetectionStrategy, inject, signal, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComandaService, EstadisticasKpi } from '../../data-access/comanda.service';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'restaurant-bar-estadisticas-page',
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

  private chartPromedios?: Chart<'bar'>;
  private chartDiario?: Chart<'line'>;

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
        this.kpis.set({ promedioDemoraGeneral: 7, bebidaMasRapida: 'Espresso', totalBebidasDespachadosHoy: 68 });
      }
    });

    this.comandaService.getEstadisticasPromedios().subscribe({
      next: data => {
        this.promediosData = {
          labels: data.map(d => d.nombreReceta),
          datasets: [{
            data: data.map(d => d.promedioMinutos),
            backgroundColor: '#0ea5e9',
            borderRadius: 4
          }]
        };
        this.renderChartPromedios();
      },
      error: () => {
        // Fallback Mocks
        this.promediosData = {
          labels: ['Espresso', 'Cappuccino', 'Limonada de Coco', 'Margarita', 'Mojito', 'Cerveza IPA'],
          datasets: [{
            data: [2, 4, 6, 8, 10, 3],
            backgroundColor: '#0ea5e9',
            borderRadius: 4
          }]
        };
        this.renderChartPromedios();
      }
    });

    this.comandaService.getEstadisticasDiarias().subscribe({
      next: data => {
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
        this.renderChartDiario();
      },
      error: () => {
        // Fallback Mocks
        this.diariaData = {
          labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
          datasets: [{
            data: [8, 15, 30, 48, 25, 18, 22, 35],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            fill: true,
            tension: 0.4
          }]
        };
        this.renderChartDiario();
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
            title: { display: true, text: 'Promedio de Demora por Bebida (min)' }
          }
        }
      });
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
            title: { display: true, text: 'Volumen de Bebidas Finalizadas (Hoy)' }
          }
        }
      });
    }
  }
}
