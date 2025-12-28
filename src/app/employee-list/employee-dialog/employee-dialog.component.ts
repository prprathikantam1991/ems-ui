import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { EmployeeRequest } from '../../models/employee-request';
import { Department } from '../../models/department';
import { EmployeeResponseDto } from '../../models/employee-response-dto';

export interface EmployeeDialogData {
  employee?: EmployeeResponseDto;
}

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.css']
})
export class EmployeeDialogComponent implements OnInit {
  employeeForm: FormGroup;
  departments: Department[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  isEditMode = false;

  statusOptions = ['ACTIVE', 'INACTIVE', 'TERMINATED'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDialogData,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) {
    this.isEditMode = !!data?.employee;
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadDepartments();
    if (this.isEditMode && this.data?.employee) {
      this.populateForm(this.data.employee);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      employeeId: ['', [Validators.maxLength(20)]],
      status: ['ACTIVE', [Validators.pattern(/^(ACTIVE|INACTIVE|TERMINATED)$/)]],
      phoneNumber: ['', [Validators.maxLength(15)]],
      address: ['', [Validators.maxLength(200)]],
      hireDate: [''],
      salary: ['', [Validators.min(0)]],
      jobTitle: ['', [Validators.maxLength(100)]],
      departmentId: [null, [Validators.required]]
    });
  }

  private populateForm(employee: EmployeeResponseDto): void {
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      employeeId: employee.employeeId || '',
      status: employee.status || 'ACTIVE',
      phoneNumber: employee.phoneNumber || '',
      address: employee.address || '',
      hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
      salary: employee.salary || '',
      jobTitle: employee.jobTitle || '',
      departmentId: employee.departmentId
    });
  }

  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.errorMessage = 'Failed to load departments. Please try again.';
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const formValue = this.employeeForm.value;
      
      // Convert Date object to YYYY-MM-DD string format if hireDate is a Date
      let hireDateStr: string | undefined = undefined;
      if (formValue.hireDate) {
        if (formValue.hireDate instanceof Date) {
          const year = formValue.hireDate.getFullYear();
          const month = String(formValue.hireDate.getMonth() + 1).padStart(2, '0');
          const day = String(formValue.hireDate.getDate()).padStart(2, '0');
          hireDateStr = `${year}-${month}-${day}`;
        } else if (typeof formValue.hireDate === 'string') {
          hireDateStr = formValue.hireDate;
        }
      }
      
      const employeeRequest: EmployeeRequest = {
        name: formValue.name,
        email: formValue.email,
        employeeId: formValue.employeeId || undefined,
        status: formValue.status || 'ACTIVE',
        phoneNumber: formValue.phoneNumber || undefined,
        address: formValue.address || undefined,
        hireDate: hireDateStr,
        salary: formValue.salary ? parseFloat(formValue.salary) : undefined,
        jobTitle: formValue.jobTitle || undefined,
        departmentId: formValue.departmentId
      };

      this.employeeService.createEmployee(employeeRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.dialogRef.close({ success: true, data: response.data });
          } else {
            const errorMsg = response.message || 'Failed to create employee';
            this.errorMessage = errorMsg;
            // Also pass error back to parent for snackbar notification
            // Don't close dialog, let user see the error and try again
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating employee:', error);
          const errorMsg = error.error?.message || 'Failed to create employee. Please try again.';
          this.errorMessage = errorMsg;
          // Show error snackbar for better visibility
          this.snackBar.open(
            errorMsg,
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
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.employeeForm.controls).forEach(key => {
        this.employeeForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get title(): string {
    return this.isEditMode ? 'Edit Employee' : 'Create Employee';
  }
}

