import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../services/department.service';
import { Department } from '../models/department';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit{

  displayedColumns: string[] = ['id', 'name', 'description'];
  departments : Department[] = [];

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({
      next: data => {
        this.departments = data;
        console.log(JSON.stringify(this.departments))
      },
      error: error => console.error(error)
    })
  }

}
