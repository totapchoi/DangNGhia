import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeList from './EmployeeList';
import 'bootstrap/dist/css/bootstrap.min.css';

function SearchEmployee({ searchQuery, setSearchQuery }) {
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      const fetchFilteredEmployees = async () => {
        const response = await axios.get(`/search?q=${searchQuery}`);
        setFilteredEmployees(response.data);
      };
      fetchFilteredEmployees();
    } else {
      setFilteredEmployees([]);
    }
  }, [searchQuery]);

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
      <EmployeeList employees={filteredEmployees} />
    </div>
  );
}

export default SearchEmployee;
