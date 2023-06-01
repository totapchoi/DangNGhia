import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DropzoneArea } from 'material-ui-dropzone';
import EmployeeContext from './EmployeeContext';

function UpdateEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const { employees, setEmployees } = useContext(EmployeeContext);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`/api/employees/${id}`);
        setEmployee(response.data);
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!employee.name || employee.name.trim() === '') {
      alert('Name field cannot be empty');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', employee.name);
      formData.append('address', employee.address);
      if (employee.picture instanceof Blob) {
        formData.append('picture', employee.picture, employee.picture.name);
      }
      await axios.put(`/api/employees/${id}`, formData);

      const updatedEmployeeIndex = employees.findIndex((e) => e.id === employee.id);
      const updatedEmployeeList = [...employees];
      const updatedEmployee = { ...employee };

      if (employee.picture instanceof Blob) {
        updatedEmployee.picture = URL.createObjectURL(employee.picture);
      }

      updatedEmployeeList[updatedEmployeeIndex] = updatedEmployee;
      setEmployees(updatedEmployeeList);

      alert(`Update ${employee.name} Successfully`);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div>
      {employee ? (
        <div>
          <h1>Update Employee</h1>
          <img src={employee.picture} alt={`${employee.name}'s picture`} />
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Employee Name"
              value={employee.name || ''}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address"
              value={employee.address || ''}
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
            />
            <DropzoneArea
              acceptedFiles={['image/*']}
              dropzoneText="Drag and drop an image here or click"
              onChange={(files) => setEmployee({ ...employee, picture: files[0] })}
            />
            <button type="submit">Update Employee</button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UpdateEmployee;
