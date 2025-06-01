import { Routes } from '@angular/router';
import { roleGuard } from '@guards/role.guard';
import { MenuPermissionComponent } from '@components/permissions/menu-permission/menu-permission.component';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['admin'])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@components/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'permissions/menu-permission',
        loadComponent: () =>
          import(
            '@components/permissions/menu-permission/menu-permission.component'
          ).then((m) => m.MenuPermissionComponent),
      },
    ],
  },
];
