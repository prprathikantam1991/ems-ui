import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { EmployeeResponse } from '../models/employeeResponse';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = 'http://localhost:8080/api/v1';
  constructor(private http: HttpClient) { }

  getEmployees(): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(this.baseUrl + '/employees');
  }
}
