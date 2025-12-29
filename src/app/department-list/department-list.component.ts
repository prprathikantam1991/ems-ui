import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../services/department.service';
import { LoggerService } from '../services/logger.service';
import { Department } from '../models/department';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit{

  displayedColumns: string[] = ['id', 'name', 'description'];
  departments : Department[] = [];

  constructor(
    private departmentService: DepartmentService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({
      next: data => {
        this.departments = data;
        this.logger.debug('Loaded departments', { count: this.departments.length });
      },
      error: error => {
        this.logger.error('Error loading departments', error);
      }
    })
  }

}
