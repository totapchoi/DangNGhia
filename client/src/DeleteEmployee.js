import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteEmployee = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch employee data and populate the employees state
    const fetchEmployeeData = async () => {
      const response = await axios.get('http://localhost:5000/search');
      setEmployees(response.data);
    };

    fetchEmployeeData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-employee/${id}`);
      alert('Employee deleted successfully');
      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (error) {
      alert('An error occurred while deleting the employee');
    }
  };

  return (
    <div>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.address}
            <button onClick={() => handleDelete(employee.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeleteEmployee;