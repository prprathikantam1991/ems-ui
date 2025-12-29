import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RoleService } from '../services/role.service';
import { LoggerService } from '../services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private roleService: RoleService,
    private router: Router,
    private logger: LoggerService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Get required roles from route data
    const requiredRoles = route.data['roles'] as string[];
    
    // If no roles specified, allow access (let AuthGuard handle authentication)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Check if user has any of the required roles
    return this.roleService.hasAnyRole(requiredRoles).pipe(
      take(1), // Complete after first emission
      map(hasRole => {
        if (hasRole) {
          return true;
        } else {
          // User doesn't have required role, redirect to dashboard
          this.logger.warn(`Access denied: User does not have required roles: ${requiredRoles.join(', ')}`);
          this.router.navigate(['/dashboard']);
          return false;
        }
      })
    );
  }
}


