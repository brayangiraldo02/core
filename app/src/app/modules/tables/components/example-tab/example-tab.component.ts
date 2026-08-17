import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';

/**
 * ============================================================================
 * GUÍA / PLANTILLA BASE PARA CREAR NUEVAS PESTAÑAS DE TABLAS EN CORE
 * ============================================================================
 *
 * Pasos para adaptar esta plantilla a un nuevo catálogo:
 * 1. Define tu interfaz de datos (ej: `MyEntity.interface.ts`).
 * 2. Ajusta `displayedColumns` con las columnas que deseas mostrar.
 * 3. Inyecta tu servicio de datos en el constructor o con `inject()`.
 * 4. Llama a tu endpoint en `loadData()`.
 * 5. Agrega el selector `<app-tu-tab></app-tu-tab>` dentro de `dashboard-view.component.html` en un `<mat-tab>`.
 */

export interface ExampleEntity {
  id: string;
  name: string;
  category: string;
  created_at: string;
  status: string;
}

@Component({
  selector: 'app-example-tab',
  standalone: false,
  templateUrl: './example-tab.component.html',
  styleUrl: './example-tab.component.css',
})
export class ExampleTabComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Parámetros para cálculo dinámico del tamaño de página según altura de pantalla
  readonly ROW_HEIGHT = 56;
  readonly FIXED_SPACE_VERTICAL = 499.5;

  // 1. Columnas a renderizar en la tabla
  displayedColumns: string[] = ['id', 'name', 'category', 'created_at', 'status', 'actions'];

  // 2. Fuente de datos de Angular Material
  dataSource = new MatTableDataSource<ExampleEntity>([]);

  // 3. Variables de paginación y búsqueda
  totalItems = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageNumber = 1;
  currentFilterValue = '';
  isLoading = false;

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.calculateDynamicPageSize(false);
    this.loadData();
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateDynamicPageSize();
  }

  /**
   * Ajusta dinámicamente la cantidad de filas según la resolución de pantalla
   */
  calculateDynamicPageSize(triggerLoad = true) {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      this.pageSizeOptions = [5, 10, 20, 50];
      if (this.pageSize !== 10) {
        this.pageSize = 10;
        if (triggerLoad) this.loadData();
      }
      return;
    }

    const windowHeight = window.innerHeight;
    const availableHeight = windowHeight - this.FIXED_SPACE_VERTICAL;
    const rowsThatFit = Math.max(1, Math.floor(availableHeight / this.ROW_HEIGHT));

    const currentOptions = new Set([rowsThatFit, 5, 10, 20, 50]);
    this.pageSizeOptions = [...currentOptions].sort((a, b) => a - b);

    if (this.pageSize !== rowsThatFit) {
      this.pageSize = rowsThatFit;
      if (triggerLoad) this.loadData();
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.pageIndex = this.pageNumber - 1;
    }
  }

  /**
   * Carga de datos desde la API o Mock Service
   */
  loadData(forceRefresh = false) {
    this.isLoading = true;

    // TODO: Reemplazar por llamada real a tu servicio. Ejemplo:
    // this.myService.getData(this.pageNumber, this.pageSize, this.currentFilterValue)
    //   .pipe(finalize(() => { this.isLoading = false; this.cdr.detectChanges(); }))
    //   .subscribe({ next: (res) => { ... } });

    // Simulación de respuesta mock:
    setTimeout(() => {
      this.dataSource.data = [
        {
          id: 'EX-001',
          name: 'Registro Ejemplo 1',
          category: 'General',
          created_at: '2026-08-16',
          status: 'Activo',
        },
        {
          id: 'EX-002',
          name: 'Registro Ejemplo 2',
          category: 'Operaciones',
          created_at: '2026-08-15',
          status: 'Activo',
        },
      ];
      this.totalItems = 2;
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 300);
  }

  /**
   * Recibe el texto de búsqueda desde <app-search-header>
   */
  applyFilter(filterValue: string) {
    this.currentFilterValue = filterValue.trim();
    this.pageNumber = 1;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadData();
  }

  /**
   * Manejo de cambio de página en el paginador
   */
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.loadData();
  }

  /**
   * Acción de ejemplo para fila (ej: abrir modal de detalles)
   */
  openDetails(row: ExampleEntity) {
    console.log('Ver detalles de:', row);
  }
}
