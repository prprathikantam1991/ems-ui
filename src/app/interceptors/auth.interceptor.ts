import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector,
    private router: Router
  ) {}

  private get authService(): AuthService {
    // Lazy inject AuthService to break circular dependency
    return this.injector.get(AuthService);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip interceptor for Auth Service requests to avoid circular dependency
    const url = request.url.toLowerCase();
    if (url.includes(environment.authServiceUrl.toLowerCase())) {
      return next.handle(request);
    }

    // Add withCredentials: true to send cookies automatically
    // The JWT token is in an HttpOnly cookie, so we don't need to manually add it
    request = request.clone({
      withCredentials: true
    });

    // Handle the request and catch errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          console.warn('Unauthorized request - token may be expired or invalid');
          
          // Redirect to login
          this.router.navigate(['/login']);
        }

        // Handle 403 Forbidden errors
        if (error.status === 403) {
          console.warn('Forbidden - insufficient permissions');
          // Optionally redirect or show error message
        }

        return throwError(() => error);
      })
    );
  }
}
