import { Component, ChangeDetectionStrategy, inject, signal, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { ComandaService, EstadisticasKpi } from '../../../../cocina/cocina/src/lib/data-access/comanda.service';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

/** Lee un token CSS del :root en tiempo de ejecución */
function cssToken(name: string, fallback = '#888'): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

@Component({
  selector: 'restaurant-estadisticas-page',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
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
        // Calcular KPIs reales desde los datos de promedios
        if (data.length > 0) {
          const tiempos = data.map(d => d.tiempoPromedioMinutos);
          const promedioGeneral = Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length * 10) / 10;
          const minTiempo = Math.min(...tiempos);
          const platoMasRapido = data.find(d => d.tiempoPromedioMinutos === minTiempo)?.nombrePlato || '—';
          
          this.promedioFormateado.set(this.minutosAHHMM(promedioGeneral));
          this.kpis.set({
            promedioDemoraGeneral: promedioGeneral,
            platoMasRapido,
            totalPlatosDespachadosHoy: 0
          });
        }

        // Preparar datos de la gráfica
        this.promediosData = {
          labels: data.map(d => d.nombrePlato),
          datasets: [{
            data: data.map(d => Math.min(d.tiempoPromedioMinutos, 60)),
            backgroundColor: '#39a900',
            borderRadius: 4,
            maxBarThickness: 32
          }]
        };
        this.renderChartPromedios();
      },
      error: (err) => {
        console.error('Error cargando estadísticas promedios:', err);
        // Fallback visual
        this.kpis.set({ promedioDemoraGeneral: 0, platoMasRapido: 'Sin datos', totalPlatosDespachadosHoy: 0 });
      }
    });

    // Contar platos preparados (en estado LISTO) desde las comandas reales
    this.comandaService.getComandas().subscribe({
      next: (comandas) => {
        const listos = comandas.filter(c => c.estado === 'LISTO').length;
        this.kpis.update(k => k ? { ...k, totalPlatosDespachadosHoy: listos } : k);
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
      this.chartPromedios = new Chart(this.graficoPromedios.nativeElement, {
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
                callback: (val) => `${val} min`
              },
              grid: { color: 'rgba(0,0,0,0.05)' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      } as any);
    }
  }
}
