import { Component, ChangeDetectionStrategy, inject, signal, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class EstadisticasPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private comandaService = inject(ComandaService);

  kpis = signal<EstadisticasKpi | null>(null);
  promedioFormateado = signal('');

  @ViewChild('graficoPromedios') graficoPromedios!: ElementRef<HTMLCanvasElement>;

  private chartPromedios: Chart | null = null;
  private promediosData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  private minutosAHHMM(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
  }

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.comandaService.getEstadisticasPromedios().subscribe({
      next: data => {
        // Calcular KPIs reales desde los datos de promedios si el backend no los trae directamente
        if (data.length > 0) {
          const tiempos = data.map(d => d.promedioMinutos);
          const promedioGeneral = Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length * 10) / 10;
          const minTiempo = Math.min(...tiempos);
          const bebidaMasRapida = data.find(d => d.promedioMinutos === minTiempo)?.nombreReceta || '—';

          this.promedioFormateado.set(this.minutosAHHMM(promedioGeneral));
          this.kpis.set({
            promedioDemoraGeneral: promedioGeneral,
            bebidaMasRapida,
            totalBebidasDespachadosHoy: 0
          });
        } else {
          // Fallback en caso de que no haya datos aún en base de datos
          this.promedioFormateado.set('00:00');
          this.kpis.set({
            promedioDemoraGeneral: 0,
            bebidaMasRapida: '—',
            totalBebidasDespachadosHoy: 0
          });
        }

        // Preparar datos de la gráfica
        this.promediosData = {
          labels: data.map(d => d.nombreReceta),
          datasets: [{
            data: data.map(d => Math.min(d.promedioMinutos, 60)),
            backgroundColor: '#39a900',
            borderRadius: 4,
            maxBarThickness: 32
          }]
        };
      },
      error: (err) => {
        console.error('Error cargando estadísticas promedios:', err);
        // Fallback visual
        this.kpis.set({ promedioDemoraGeneral: 0, bebidaMasRapida: 'Sin datos', totalBebidasDespachadosHoy: 0 });
      }
    });

    // Contar bebidas preparadas (en estado LISTO) desde las comandas reales
    this.comandaService.listarComandas().subscribe({
      next: (comandas) => {
        const listos = comandas.filter(c => c.estadoPreparacion === 'LISTO').length;
        this.kpis.update(k => k ? { ...k, totalBebidasDespachadosHoy: listos } : k);
      }
    });
  }

  ngAfterViewInit(): void {
    this.renderChartPromedios();
  }

  ngOnDestroy(): void {
    if (this.chartPromedios) this.chartPromedios.destroy();
  }

  private renderChartPromedios() {
    if (!this.graficoPromedios?.nativeElement || this.promediosData.labels?.length === 0) return;

    if (this.chartPromedios) {
      this.chartPromedios.data = this.promediosData;
      this.chartPromedios.update();
    } else {
      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: this.promediosData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.parsed.y.toFixed(1)} min`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 60,
              ticks: {
                stepSize: 10,
                callback: (val) => {
                  // Manejar de forma segura el valor devuelto para evitar errores de firma
                  return `${val} min`;
                }
              },
              grid: { color: 'rgba(0,0,0,0.05)' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      };
      this.chartPromedios = new Chart(this.graficoPromedios.nativeElement, config);
    }
  }
}
