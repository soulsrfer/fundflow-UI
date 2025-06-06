import { Routes } from "@angular/router";
import { roleGuard } from "@guards/role.guard";

export const managerRoutes: Routes = [
    {
        path: '',
        canActivate: [roleGuard(['manager'])],
        children: [
            {
                path:'',
                loadComponent: () =>
                    import('@components/manager/manager-dashboard/manager-dashboard.component').then(
                        (m) => m.ManagerDashboardComponent
                    ),
            },
            {
                path: 'members',
                loadComponent: () =>
                    import('@components/manager/members/members.component').then(
                        (m) => m.MembersComponent
                    ),
            },
            {
                path: 'loans',
                loadComponent: () =>
                    import('@components/manager/loans/loans.component').then(
                        (m) => m.LoansComponent
                    ),
            },
            {
                path: 'contributions',
                loadComponent: () =>
                    import('@components/manager/contributions/contributions.component').then(
                        (m) => m.ContributionsComponent
                    ),
            },
            {
                path: 'schedule-entries',
                loadComponent: () =>
                    import('@components/manager/schedule-entries/schedule-entries.component').then(
                        (m) => m.ScheduleEntriesComponent
                    ),
            },
            {
                path: 'transactions',
                loadComponent: () =>
                    import('@components/manager/transactions/transactions.component').then(
                        (m) => m.TransactionsComponent
                    ),
            }
        ]
            
    }
]