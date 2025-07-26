import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@service/auth.service';
import { ToasterService } from '@service/toaster.service';
import { catchError, tap, throwError } from 'rxjs';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toaster = inject(ToasterService);

  return next(req).pipe(
    tap((response: any) => {
      const status = response?.status;
      const message = response?.body?.message;

      if (status >= 200 && status < 300 && req.method !== 'GET' && response?.body?.success) {
        switch (status) {
          case 200:
            toaster.showSuccess(message || 'Updated successfully.');
            break;
          case 201:
            if(message) {
              toaster.showSuccess(message || 'Created successfully.');
            }
            break;
          case 204:
            toaster.showSuccess(message || 'Deleted successfully.');
            break;
          default:
            toaster.showSuccess(message || 'Operation completed successfully.');
        }
      }
    }),

    catchError((error) => {
      console.error('Interceptor response Error:', error);
      const message = error?.error?.message;

      switch (error.status) {
        case 400:
          toaster.showError('Bad Request: ' + (message || 'Invalid request'));
          break;
        case 401:
          authService.logout();
          toaster.showError('Unauthorized: ' + (message || 'Please log in again.'));
          break;
        case 500:
          toaster.showError('Internal Server Error: ' + (message || 'An unexpected error occurred.'));
          break;
        case 409:
          toaster.showError('Conflict: ' + (message || 'Data already exists.'));
          break;
        default:
          toaster.showError('Unexpected error.');
      }

      return throwError(() => error);
    })
  );
};
