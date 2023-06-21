import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/employees`);
  }

  searchEmployees(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search`, { params: { q: query } });
  }

  addEmployee(employee: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('address', employee.address);
    formData.append('picture', employee.picture);

    return this.http.post<any>(`${this.baseUrl}/add-employee`, formData);
  }

  updateEmployee(id: number, employee: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('address', employee.address);
    formData.append('picture', employee.picture);

    return this.http.put<any>(`${this.baseUrl}/employees/${id}`, formData);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete-employee/${id}`);
  }

  getEmployee(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/employees/${id}`);
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

}
