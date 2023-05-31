import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DropzoneArea } from 'material-ui-dropzone';
import EmployeeContext from './EmployeeContext';

function AddEmployee() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [picture, setPicture] = useState(null);
  const navigate = useNavigate();
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const { employees, setEmployees } = useContext(EmployeeContext);

  const handleAddEmployee = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', name);
  formData.append('address', address);
  if (picture) {
    formData.append('picture', picture, picture.name);
  }

  try {
    const response = await axios.post('/add-employee', formData);
    const newEmployee = response.data;
    setEmployees([...employees, newEmployee]);
    navigate('/');
    setDropzoneKey(dropzoneKey + 1);
  } catch (error) {
    console.error('Error adding employee:', error);
  }
};


  return (
    <div className="add-employee-form">
      <form onSubmit={handleAddEmployee}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <DropzoneArea
          acceptedFiles={['image/*']}
          dropzoneText="Drag and drop an image here or click"
          onChange={(files) => setPicture(files[0])}
        />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
}

export default AddEmployee;
