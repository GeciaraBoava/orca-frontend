import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';
import {HttpInterceptorFn} from '@angular/common/http';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']).then(
          () => console.log('Redirecionado para login'),
          (err) => console.error('Erro ao redirecionar:', err)
        );
      }
      return throwError(() => error);
    })
  );
};

