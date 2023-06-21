import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee: any = {};
  @Output() submitForm = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    if (!this.employee) {
      this.employee = {};
    }
  }

  onSubmit(): void {
    this.submitForm.emit(this.employee);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.employee.picture = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
