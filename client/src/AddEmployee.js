import React, { useState, useContext } from 'react';
import axios from 'axios';
import { DropzoneArea } from 'material-ui-dropzone';
import EmployeeContext from './EmployeeContext';
import './EmployeeForm.css';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

function AddEmployee() {
  const [employee, setEmployee] = useState({
    name: '',
    address: '',
    picture: null,
  });
  const { employees, setEmployees } = useContext(EmployeeContext);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', employee.name);
      formData.append('address', employee.address);
      if (employee.picture) {
        formData.append('picture', employee.picture, employee.picture.name);
      }
      const response = await axios.post('/add-employee', formData);

      if (response.data.success) {
        const imageUrl = employee.picture
          ? URL.createObjectURL(employee.picture)
          : '../../uploads/default.jpeg';

        const newEmployee = { ...employee, picture: imageUrl };
        setEmployees([...employees, newEmployee]);

        setModalIsOpen(true);
        setEmployee({ name: '', address: '', picture: null });
      } else {
        alert(response.data.message);
      }
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
          required
          pattern="\S+.*"
          className='input-field'
        />
        <input
          type="text"
          placeholder="Address"
          value={employee.address}
          onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
          className="input-field"
        />
        <DropzoneArea
          acceptedFiles={['image/*']}
          dropzoneText="Drag and drop an image here or click"
          onChange={(files) => setEmployee({ ...employee, picture: files[0] })}
        />
        <button type="submit">Add Employee</button>
      </form>
       <ReactModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Success</h2>
        <p>Add {employee.name} Successfully</p>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </ReactModal>
    </div>
  );
}

export default AddEmployee;
