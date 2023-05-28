import React from 'react';
function EmployeeList({ employees }) {
  console.log('EmployeeList received employees:', employees);
  return (
    <div className="employees-list">
      {employees.map((employee) => (
        <div key={employee.id} className="employee-item">
          <img src={employee.picture} alt="Employee picture" />
          <h5 className="employee-name">{employee.name}</h5>
          <p className="employee-address">{employee.address}</p>
        </div>
      ))}
    </div>
  );
}

export default EmployeeList;
