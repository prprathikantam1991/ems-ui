import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { EmployeeResponse } from '../models/employeeResponse';
import { EmployeeRequest } from '../models/employee-request';
import { ApiResponse } from '../models/api-response';
import { EmployeeResponseDto } from '../models/employee-response-dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) { }

  getEmployees(): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(this.baseUrl + '/employees');
  }

  createEmployee(employee: EmployeeRequest): Observable<ApiResponse<EmployeeResponseDto>> {
    return this.http.post<ApiResponse<EmployeeResponseDto>>(
      this.baseUrl + '/employees',
      employee,
      { withCredentials: true }
    );
  }
}
