import { Component } from '@angular/core';

export interface MenuOption {
  title: string;
  description: string;
  icon: string;
  route: string;
  colorClass: string;
  iconBg?: string;
  borderColor?: string;
  disabled?: boolean;
  tooltip?: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  menuOptions: MenuOption[] = [
    {
      title: 'Tablas de Muestra',
      description:
        'Gestión de registros, clientes, inventario y vehículos con paginación y filtros.',
      icon: 'table_view',
      route: '/tablas',
      colorClass: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
      iconBg: 'bg-indigo-100 group-hover:bg-white/20',
      borderColor: 'hover:border-indigo-200',
      disabled: false,
    },
    {
      title: 'Inventarios',
      description: 'Control de existencias, bodegas, precios y movimientos.',
      icon: 'inventory_2',
      route: '/tablas',
      colorClass: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
      iconBg: 'bg-amber-100 group-hover:bg-white/20',
      borderColor: 'hover:border-amber-200',
      disabled: false,
    },
    {
      title: 'Facturación y Cartera',
      description: 'Módulo para emisión de comprobantes, cobros y cuentas.',
      icon: 'receipt_long',
      route: '',
      colorClass:
        'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
      iconBg: 'bg-emerald-100 group-hover:bg-white/20',
      borderColor: 'hover:border-emerald-200',
      disabled: true,
      tooltip: 'Módulo en desarrollo para futuros proyectos',
    },
    {
      title: 'Auditoría e Inspecciones',
      description: 'Revisión y checklist de estado para operaciones.',
      icon: 'fact_check',
      route: '',
      colorClass: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
      iconBg: 'bg-rose-100 group-hover:bg-white/20',
      borderColor: 'hover:border-rose-200',
      disabled: true,
      tooltip: 'Módulo en desarrollo para futuros proyectos',
    },
  ];
}
