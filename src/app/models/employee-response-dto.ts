export interface EmployeeResponseDto {
    id: number;
    name: string;
    email: string;
    employeeId?: string;
    status?: string;
    phoneNumber?: string;
    address?: string;
    hireDate?: string; // ISO date string
    salary?: number;
    jobTitle?: string;
    departmentId: number;
    departmentName?: string;
    createdAt?: string;
    updatedAt?: string;
    version?: number;
}

