// App.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AddEmployee from './AddEmployee';
import EmployeeList from './EmployeeList';
import SearchEmployee from './SearchEmployee';
import DeleteEmployee from './DeleteEmployee';

function App() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEmployees = useCallback(async (query = '') => {
    try {
      const response = await axios.get(`/search?q=${query}`);
      console.log('Fetched employees data:', response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      console.error('Error details:', error.response);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log('Employees state:', employees);
  }, [fetchEmployees, searchQuery]);

  return (
    <Router>
      <div className="container">
        <nav>
          <ul>
            <li>
              <Link to="/">Employee List</Link>
            </li>
            <li>
              <Link to="/search">Search Employee</Link>
            </li>
            <li>
              <Link to="/add-employee">Add Employee</Link>
            </li>
            <li>
              <Link to="/delete-employee">Delete Employee</Link>
            </li>
          </ul>
        </nav>
        {employees.length > 0 && (
          <Routes>
            <Route exact path="/" element={<EmployeeList employees={employees} />} />
            <Route
              path="/search"
              element={
                <SearchEmployee
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              }
            />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/delete-employee" element={<DeleteEmployee />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
