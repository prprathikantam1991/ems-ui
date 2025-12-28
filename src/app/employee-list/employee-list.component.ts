import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';
import { RoleService } from '../services/role.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'employeeId', 'name', 'email', 'status'];
  employees : Employee[] = [];
  canCreateEmployee$: Observable<boolean>;

  constructor(
    private employeeService: EmployeeService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.canCreateEmployee$ = this.roleService.hasRole('ADMIN');
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: data => {
        this.employees = data.content;
        console.log(JSON.stringify(this.employees));
      },
      error: error => {
        console.error(error);
        this.snackBar.open(
          'Failed to load employees. Please try again.',
          'Close',
          {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  openCreateEmployeeDialog(): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '600px',
      data: { employee: null } // null for create mode
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        // Show success notification
        this.snackBar.open(
          'Employee created successfully',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          }
        );
        // Refresh employee list after successful creation
        this.loadEmployees();
      } else if (result?.error) {
        // Show error notification if error was passed from dialog
        this.snackBar.open(
          result.error || 'Failed to create employee. Please try again.',
          'Close',
          {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          }
        );
      }
      // If result is undefined/null, user cancelled - no notification needed
    });
  }

}
