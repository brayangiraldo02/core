import { Component, inject, signal } from '@angular/core';
import { TablesService } from '../../services/tables.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-example-tab',
  standalone: false,
  templateUrl: './example-tab.component.html',
  styleUrl: './example-tab.component.css',
})
export class ExampleTabComponent {
  private tablesService = inject(TablesService);
  private snackbarService = inject(SnackbarService);

  loadingEntity = signal<string | null>(null);

  generatePdf(entity: string): void {
    this.loadingEntity.set(entity);
    this.snackbarService.openSnackBar(`Generando reporte de ${entity}...`);

    this.tablesService
      .downloadReportPdf(entity)
      .pipe(
        finalize(() => {
          this.loadingEntity.set(null);
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
          this.snackbarService.openSnackBar('¡Reporte generado con éxito!');
        },
        error: (err) => {
          console.error('Error al generar PDF:', err);
          this.snackbarService.openSnackBar('Error al generar el PDF.');
        },
      });
  }
}
