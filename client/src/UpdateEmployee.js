import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EmployeeContext from './EmployeeContext';
import ReactModal from 'react-modal';
import EmployeeForm from './EmployeeForm';
import './modalStyles.css';


ReactModal.setAppElement('#root');

function UpdateEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const { employees, setEmployees } = useContext(EmployeeContext);

  const [modalIsOpen, setModalIsOpen] = useState(false);

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

      setModalIsOpen(true);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div>
      {employee ? (
        <div>
          <img src={employee.picture} alt={`${employee.name}'s picture`} />
           <EmployeeForm
            employee={employee}
            setEmployee={setEmployee}
            handleSubmit={handleUpdate}
            formTitle="Update Employee"
            submitButtonText="Update Employee"
          />
          <ReactModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="custom-modal-style" overlayClassName="modal-overlay">
            <h2>Success</h2>
            <p>Update {employee.name} Successfully</p>
            <button onClick={() => setModalIsOpen(false)}>Close</button>
          </ReactModal>
        </div>
      ) : (
        <p>Loading...</p>
      )}

    </div>
  );
}

export default UpdateEmployee;