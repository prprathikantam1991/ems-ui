import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userInfo$: Observable<any>;
  canAccessEmployees$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private roleService: RoleService
  ) {
    // Get user information from cached Observable
    this.userInfo$ = this.authService.userInfo$;
    // Check if user can access employees (HR or ADMIN role)
    this.canAccessEmployees$ = this.roleService.hasAnyRole(['HR', 'ADMIN']);
  }

  ngOnInit(): void {
    // User info is automatically available via userInfo$ Observable
    // It's cached and shared, so no redundant API calls
    // Roles are checked via RoleService for conditional rendering
  }
}
