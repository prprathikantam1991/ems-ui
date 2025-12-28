import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../models/department';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private baseUrl = environment.apiBaseUrl;
  constructor(private httpClient: HttpClient) { }

  getDepartments() : Observable<Department[]> {
    return this.httpClient.get<Department[]>(this.baseUrl + '/departments');
  }
}
