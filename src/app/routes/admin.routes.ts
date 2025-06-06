import { Routes } from '@angular/router';
import { roleGuard } from '@guards/role.guard';
import { MenuPermissionComponent } from '@components/admin/permissions/menu-permission/menu-permission.component';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['admin'])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@components/admin/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'permissions/menu-permission',
        loadComponent: () =>
          import(
            '@components/admin/permissions/menu-permission/menu-permission.component'
          ).then((m) => m.MenuPermissionComponent),
      },
    ],
  },
];
