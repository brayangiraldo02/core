import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

const routes: Routes = [
  {
    path: 'login',
    // canActivate: [noAuthGuard], // DESCOMENTAR PARA PROTEGER
    loadChildren: () => import('./modules/auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [authGuard], // DESCOMENTAR PARA PROTEGER
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard-module').then((m) => m.DashboardModule),
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
