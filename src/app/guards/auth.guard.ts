// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const role = authService.getRole();
  console.log('Current URL:', state.url);
  if (state.url === '/dashboard') {
    console.log('User role:', role);
    switch (role) {
      case 'admin':
        router.navigate(['/dashboard/admin']);
        break;
      case 'manager':
        router.navigate(['/dashboard/manager']);
        break;
      default:
        router.navigate(['/login']);
    }
    return false; // prevent loading empty LayoutComponent
  }

  return true; // allow access to nested routes
};
