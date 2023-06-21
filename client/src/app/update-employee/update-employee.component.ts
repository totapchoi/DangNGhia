import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent implements OnInit {
  employee: any;

  constructor(private route: ActivatedRoute, private router: Router, private employeeService: EmployeeService, private dialog: MatDialog) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getEmployee(Number(id)).subscribe((employee) => {
        this.employee = employee;
      });
    }
  }

  
  updateEmployee(employee: any): void {
    this.employeeService.updateEmployee(this.employee.id, employee).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  openDialog(employee: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Do you want to update this employee?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.updateEmployee(employee);
      }
    });
  }
}
