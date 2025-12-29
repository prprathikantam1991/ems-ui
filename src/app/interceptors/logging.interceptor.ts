import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { environment } from '../../environments/environment';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  constructor(private logger: LoggerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip logging for auth service URLs to avoid circular dependencies
    const url = request.url.toLowerCase();
    if (url.includes(environment.authServiceUrl.toLowerCase())) {
      return next.handle(request);
    }

    // Log request details at debug level
    this.logger.debug(`HTTP Request: ${request.method} ${request.url}`, {
      method: request.method,
      url: request.url,
      headers: request.headers.keys()
    });

    // Handle the request and log response/errors
    return next.handle(request).pipe(
      tap((event: HttpEvent<unknown>) => {
        // Log successful responses at info level
        if (event instanceof HttpResponse) {
          this.logger.info(`HTTP Response: ${event.status} ${request.method} ${request.url}`, {
            status: event.status,
            statusText: event.statusText,
            method: request.method,
            url: request.url
          });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Log ALL HTTP errors at error level with basic details
        const errorMessage = error.error?.message || error.message || 'Unknown error';
        this.logger.error(`HTTP Error: ${error.status || 'Network Error'} ${request.method} ${request.url}`, {
          status: error.status,
          statusText: error.statusText,
          message: errorMessage,
          method: request.method,
          url: request.url
        });

        // Re-throw the error so other interceptors (like AuthInterceptor) can handle it
        return throwError(() => error);
      })
    );
  }
}

