import { Employee } from './employee'

export interface EmployeeResponse {
    content: Employee[];
    totalPages: number;
    totalElements: number;
}