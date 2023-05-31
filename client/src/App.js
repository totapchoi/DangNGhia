import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AddEmployee from './AddEmployee';
import EmployeeList from './EmployeeList';
import SearchEmployee from './SearchEmployee';
import UpdateEmployee from './UpdateEmployee';
import EmployeeContext from './EmployeeContext';

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
          </ul>
        </nav>
        <EmployeeContext.Provider value={{ employees, setEmployees }}>
          <Routes>
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
            <Route path="/update-employee/:id" element={<UpdateEmployee />} />
            <Route exact path="/" element={<EmployeeList />} />
          </Routes>
        </EmployeeContext.Provider>
      </div>
    </Router>
  );
}

export default App;
