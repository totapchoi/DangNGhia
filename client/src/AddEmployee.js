import React, { useState, useContext } from 'react';
import axios from 'axios';
import EmployeeContext from './EmployeeContext';
import EmployeeForm from './EmployeeForm';
import ReactModal from 'react-modal';
import './modalStyles.css';


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
      <EmployeeForm
        employee={employee}
        setEmployee={setEmployee}
        handleSubmit={handleAdd}
        formTitle="Add Employee"
        submitButtonText="Add Employee"
      />
       <ReactModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="custom-modal-style" overlayClassName="modal-overlay">
        <h2>Success</h2>
        <p>Add {employee.name} Successfully</p>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </ReactModal>
    </div>
  );
}

export default AddEmployee;
