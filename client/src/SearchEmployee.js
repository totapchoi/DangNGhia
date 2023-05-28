import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeList from './EmployeeList';

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
    <div className="search-container">
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <EmployeeList employees={filteredEmployees} />
    </div>
  );
}

export default SearchEmployee;
