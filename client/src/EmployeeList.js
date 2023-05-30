// EmployeeList.js
import React from 'react';
import { Link } from 'react-router-dom';

function EmployeeList({ employees }) {
  return (
    <div>
      <h1>Employee List</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>
                <Link to={`/update-employee/${employee.id}`} className="btn btn-primary">
                  Update
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
