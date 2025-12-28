import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RoleService } from './services/role.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ems-ui';
  isAuthenticated$: Observable<boolean>;
  userInfo$: Observable<any>;
  canAccessEmployees$: Observable<boolean>;
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    public roleService: RoleService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.userInfo$ = this.authService.userInfo$;
    // Check if user can access employees (HR or ADMIN role)
    this.canAccessEmployees$ = this.roleService.hasAnyRole(['HR', 'ADMIN']);
  }

  ngOnInit(): void {
    // User info is now automatically available via userInfo$ Observable
    // No need to manually fetch - it's cached and shared
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
