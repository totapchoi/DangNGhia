import React, { useState, useContext } from 'react';
import axios from 'axios';
import { DropzoneArea } from 'material-ui-dropzone';
import EmployeeContext from './EmployeeContext';

function AddEmployee() {
  const [employee, setEmployee] = useState({
    name: '',
    address: '',
    picture: null,
  });
  const { employees, setEmployees } = useContext(EmployeeContext);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!employee.name || employee.name.trim() === '') {
      alert('Name field cannot be empty');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', employee.name);
      formData.append('address', employee.address);
      if (employee.picture) {
        formData.append('picture', employee.picture, employee.picture.name);
      }
      const response = await axios.post('/add-employee', formData);

      const imageUrl = employee.picture
        ? URL.createObjectURL(employee.picture)
        : '../../uploads/default.jpeg';

      const newEmployee = { ...employee, picture: imageUrl };
      setEmployees([...employees, newEmployee]);

      alert(`Add ${employee.name} Successfully`);
      setEmployee({ name: '', address: '', picture: null });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <div>
      <h1>Add Employee</h1>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Employee Name"
          value={employee.name}
          onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={employee.address}
          onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
        />
        <DropzoneArea
          acceptedFiles={['image/*']}
          dropzoneText="Drag and drop an image here or click"
          onChange={(files) => setEmployee({ ...employee, picture: files[0] })}
        />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
}

export default AddEmployee;
