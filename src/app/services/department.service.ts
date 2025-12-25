import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private baseUrl = 'http://localhost:8080/api/v1';
  constructor(private httpClient: HttpClient) { }

  getDepartments() : Observable<Department[]> {
    return this.httpClient.get<Department[]>(this.baseUrl + '/departments');
  }
}
