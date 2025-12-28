import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Single source of truth: userInfo$ 
  private userInfoSubject = new BehaviorSubject<any>(null);
  public userInfo$: Observable<any> = this.userInfoSubject.asObservable();
  
  // Derived from userInfo$ - automatically stays in sync
  public isAuthenticated$: Observable<boolean> = this.userInfo$.pipe(
    map(userInfo => userInfo !== null)
  );

  private userInfoCache$: Observable<any> | null = null;
  private isFetchingUserInfo = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Fetch user info on initialization
    this.fetchUserInfo().subscribe();
  }

  /**
   * Initiate login by redirecting to Auth Service
   */
  public login(): void {
    window.location.href = `${environment.authServiceUrl}/auth/login`;
  }

  /**
   * Logout by calling Auth Service logout endpoint
   */
  public logout(): void {
    this.http.post(`${environment.authServiceUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.clearUserInfo();
          this.router.navigate(['/login']);
        },
        error: () => {
          // Still navigate to login even if logout call fails
          this.clearUserInfo();
          this.router.navigate(['/login']);
        }
      });
  }

  /**
   * Fetch user info from API and cache it
   * Returns observable that emits userInfo when fetch completes
   */
  private fetchUserInfo(): Observable<any> {
    // If already fetching, return the existing observable
    if (this.isFetchingUserInfo && this.userInfoCache$) {
      return this.userInfoCache$;
    }

    // If we already have cached value, return it immediately
    if (this.userInfoSubject.value !== null) {
      return of(this.userInfoSubject.value);
    }

    this.isFetchingUserInfo = true;
    this.userInfoCache$ = this.http.get(`${environment.authServiceUrl}/auth/user`, { withCredentials: true })
      .pipe(
        tap(userInfo => {
          this.userInfoSubject.next(userInfo);
          this.isFetchingUserInfo = false;
          
          // If authenticated and on login page, redirect to dashboard
          if (userInfo !== null && this.router.url === '/login') {
            this.router.navigate(['/dashboard']);
          }
        }),
        catchError(() => {
          this.userInfoSubject.next(null);
          this.isFetchingUserInfo = false;
          this.userInfoCache$ = null;
          return of(null);
        }),
        shareReplay(1) // Share the result with all subscribers
      );

    return this.userInfoCache$;
  }

  /**
   * Ensure user info is fetched (useful for guards)
   * Returns observable that completes after fetch
   */
  public ensureUserInfoFetched(): Observable<any> {
    const fetch$ = this.fetchUserInfo();
    // Trigger the fetch by subscribing (shareReplay ensures only one HTTP request)
    fetch$.subscribe();
    return fetch$;
  }

  /**
   * Clear user info
   */
  private clearUserInfo(): void {
    this.userInfoSubject.next(null);
    this.userInfoCache$ = null;
    this.isFetchingUserInfo = false;
  }
}
