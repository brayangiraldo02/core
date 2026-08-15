import { Component, OnDestroy, inject, signal } from '@angular/core';
import { TablesService } from '../../services/tables.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard-view',
  standalone: false,
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.css',
})
export class DashboardViewComponent implements OnDestroy {
  private tablesService = inject(TablesService);
  private snackbarService = inject(SnackbarService);

  isDownloadingPdf = signal<boolean>(false);
  selectedTabIndex = 0;

  ngOnDestroy(): void {
    this.tablesService.clearCache();
  }

  downloadPdf(entity: string = 'vehicles'): void {
    this.isDownloadingPdf.set(true);
    this.snackbarService.openSnackBar('Generando reporte PDF con plantilla...');

    this.tablesService
      .downloadReportPdf(entity)
      .pipe(
        finalize(() => {
          this.isDownloadingPdf.set(false);
        }),
      )
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte_${entity}_${new Date().toISOString().slice(0, 10)}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.snackbarService.openSnackBar('¡Reporte PDF descargado correctamente!');
        },
        error: (err) => {
          console.error('Error al generar PDF:', err);
          this.snackbarService.openSnackBar(
            'Error al generar el PDF. Verifica que wkhtmltopdf esté configurado.',
          );
        },
      });
  }

  downloadCurrentTabPdf(): void {
    const map = ['vehicles', 'owners', 'inventory', 'vehicles'];
    const entity = map[this.selectedTabIndex] || 'vehicles';
    this.downloadPdf(entity);
  }
}
