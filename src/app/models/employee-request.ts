export interface EmployeeRequest {
    name: string;
    email: string;
    employeeId?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
    phoneNumber?: string;
    address?: string;
    hireDate?: string; // ISO date string (YYYY-MM-DD)
    salary?: number;
    jobTitle?: string;
    departmentId: number;
}

