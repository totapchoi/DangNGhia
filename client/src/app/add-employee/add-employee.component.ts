import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee-service.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  constructor(private employeeService: EmployeeService, private router: Router) {}

  addEmployee(employee: any): void {
    this.employeeService.addEmployee(employee).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
