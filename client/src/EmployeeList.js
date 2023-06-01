import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EmployeeContext from './EmployeeContext';

function EmployeeList() {
  const { employees, setEmployees } = useContext(EmployeeContext);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
  const fetchEmployees = async (query = '') => {
    try {
      const response = await axios.get('/search', { params: { q: query } });
      if (JSON.stringify(response.data) !== JSON.stringify(employees)) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  fetchEmployees(searchQuery);
}, [searchQuery, employees]);


  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await axios.delete(`/delete-employee/${id}`);
      const employeeToDelete = employees.find((employee) => employee.id === id);
      setEmployees(employees.filter((employee) => employee.id !== id));
      alert(`Delete ${employeeToDelete.name} Successfully`);
    } catch (error) {
      alert('An error occurred while deleting the employee');
    } finally {
      setDeleting(false);
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedEmployees = searchQuery ? filteredEmployees : employees;

  return (
    <div className="container">
      <form className="form-group" onSubmit={(e) => {
        e.preventDefault();
        setSearchQuery('');
      }}>
        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </div>
      </form>
      <h1>Employee List</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Picture</th>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <img
                  src={employee.picture}
                  alt={`${employee.name}'s avatar`}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </td>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.address}</td>
              <td>
                <Link to={`/update-employee/${employee.id}`} className="btn btn-primary">
                  Update
                </Link>
              </td>
              <td>
                <button onClick={() => handleDelete(employee.id)} className="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
