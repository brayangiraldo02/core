import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  menuOptions = [
    {
      title: 'Tablas',
      icon: 'table_view',
      route: '/tablas',
      color: 'text-indigo-500 bg-indigo-50',
      hoverColor: 'group-hover:text-indigo-600'
    },
    {
      title: 'Inventarios',
      icon: 'inventory_2',
      route: '/inventarios',
      color: 'text-orange-400 bg-orange-50',
      hoverColor: 'group-hover:text-orange-500'
    },
    {
      title: 'Facturación',
      icon: 'receipt_long',
      route: '/facturacion',
      color: 'text-emerald-500 bg-emerald-50',
      hoverColor: 'group-hover:text-emerald-600'
    },
    {
      title: 'Cartera',
      icon: 'account_balance_wallet',
      route: '/cartera',
      color: 'text-violet-500 bg-violet-50',
      hoverColor: 'group-hover:text-violet-600'
    },
    {
      title: 'Inspecciones',
      icon: 'fact_check',
      route: '/inspecciones',
      color: 'text-rose-500 bg-rose-50',
      hoverColor: 'group-hover:text-rose-600'
    },
    {
      title: 'Utilidades',
      icon: 'build',
      route: '/utilidades',
      color: 'text-slate-500 bg-slate-100',
      hoverColor: 'group-hover:text-slate-600'
    },
  ];
}
