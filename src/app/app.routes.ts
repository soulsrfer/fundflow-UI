import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from '@components/not-found/not-found.component';
import { ErrorComponent } from '@components/error/error.component';
import { LoginComponent } from '@components/login/login.component';
import { authGuard } from '@guards/auth.guard';
import { DashboardComponent } from '@components/dashboard/dashboard.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component:LoginComponent },
    {
        path: 'app',
        component: LayoutComponent,
        canActivate: [authGuard], 
        children: [
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            { path: 'dashboard', component: DashboardComponent },
            {path: 'admin', loadComponent: () => import('@components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
        ]
    },
    { path: 'error', component: ErrorComponent },
    { path: '**', redirectTo: 'notfound' },
    { path: 'notfound', component: NotFoundComponent },
];
