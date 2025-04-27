import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    {path: '', redirectTo: 'auth', pathMatch: 'full'},
    { path: 'auth', loadChildren: () => import('./auth/auth.routes') },
    {
        path: 'home',
        component: LayoutComponent,
        children: [
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            { path: 'dashboard', component: DashboardComponent },
        ]
    },
    { path: '**', redirectTo: 'notfound' },
    { path: 'notfound', component: NotFoundComponent },
];
