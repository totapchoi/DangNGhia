import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EmployeeContext from './EmployeeContext';

function EmployeeList() {
  const { employees, setEmployees } = useContext(EmployeeContext);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (id) => {
  setDeleting(true);
  try {
    await axios.delete(`/delete-employee/${id}`);
    const employeeToDelete = employees.find((employee) => employee.id === id);
    setEmployees(employees.filter((employee) => employee.id !== id));
    alert(`Delete ${employeeToDelete.name} Successfully`);
  } catch (error) {
    alert('An error occurred while deleting the employee');
  } finally {
    setDeleting(false);
  }
};



     return (
       <div>
         <h1>Employee List</h1>
         <table className="table">
           <thead>
             <tr>
               <th>Picture</th>
               <th>ID</th>
               <th>Name</th>
               <th>Adress</th>
               <th>Actions</th>
             </tr>
           </thead>
           <tbody>
             {employees.map((employee) => (
               <tr key={employee.id}>
                 <td>
                   <img
                     src={employee.picture}
                     alt={`${employee.name}'s avatar`}
                     style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                   />
                 </td>
                 <td>{employee.id}</td>
                 <td>{employee.name}</td>
                 <td>{employee.address}</td>
                 <td>
                   <Link to={`/update-employee/${employee.id}`} className="btn btn-primary">
                     Update
                   </Link>
                   <button onClick={() => handleDelete(employee.id)} className="btn btn-danger">
                     Delete
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     );
   }

   export default EmployeeList;
