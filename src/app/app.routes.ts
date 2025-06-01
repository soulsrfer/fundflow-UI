import { ErrorComponent } from '@components/error/error.component';
import { NotFoundComponent } from '@components/not-found/not-found.component';
import { roleGuard } from '@guards/role.guard';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from '@guards/auth.guard';
import { LoginComponent } from '@components/login/login.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('@routes/admin.routes').then((m) => m.adminRoutes),
      },
      {
        path: 'manager',
        canActivate: [roleGuard(['manager'])],
        loadComponent: () =>
          import(
            '@components/manager-dashboard/manager-dashboard.component'
          ).then((m) => m.ManagerDashboardComponent),
      },
    ],
  },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: NotFoundComponent },
];
