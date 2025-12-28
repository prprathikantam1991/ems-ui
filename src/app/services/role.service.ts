import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private roles$: Observable<string[]>;

  constructor(private authService: AuthService) {
    // Extract roles from userInfo$ Observable
    this.roles$ = this.authService.userInfo$.pipe(
      map(userInfo => {
        if (userInfo && userInfo.roles) {
          return userInfo.roles;
        }
        return [];
      })
    );
  }

  /**
   * Get all user roles as Observable
   */
  getRoles(): Observable<string[]> {
    return this.roles$;
  }

  /**
   * Check if user has a specific role
   * @param role Role to check (e.g., 'ROLE_HR' or 'HR')
   * @returns Observable<boolean>
   */
  hasRole(role: string): Observable<boolean> {
    return this.roles$.pipe(
      map(roles => {
        if (!roles || roles.length === 0) {
          return false;
        }
        // Normalize input role (add ROLE_ prefix if not present)
        const normalizedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
        // Check if any user role matches (with or without ROLE_ prefix)
        return roles.some(r => {
          const normalizedUserRole = r.startsWith('ROLE_') ? r : `ROLE_${r}`;
          return r === role || r === normalizedRole || normalizedUserRole === normalizedRole;
        });
      })
    );
  }

  /**
   * Check if user has any of the specified roles
   * @param roles Array of roles to check
   * @returns Observable<boolean>
   */
  hasAnyRole(roles: string[]): Observable<boolean> {
    return this.roles$.pipe(
      map(userRoles => {
        if (!userRoles || userRoles.length === 0) {
          return false;
        }
        return roles.some(role => {
          const normalizedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
          return userRoles.some(r => r === role || r === normalizedRole);
        });
      })
    );
  }

  /**
   * Check if user has all of the specified roles
   * @param roles Array of roles to check
   * @returns Observable<boolean>
   */
  hasAllRoles(roles: string[]): Observable<boolean> {
    return this.roles$.pipe(
      map(userRoles => {
        if (!userRoles || userRoles.length === 0) {
          return false;
        }
        return roles.every(role => {
          const normalizedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
          return userRoles.some(r => r === role || r === normalizedRole);
        });
      })
    );
  }
}

