import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DropzoneArea } from 'material-ui-dropzone';

function UpdateEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

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
    try {
      const formData = new FormData();
      formData.append('address', employee.address);
      if (employee.picture instanceof Blob) {
        formData.append('picture', employee.picture, employee.picture.name);
      }
      await axios.put(`/api/employees/${id}`, formData);

      if (employee.picture instanceof Blob) {
        setEmployee({ ...employee, picture: URL.createObjectURL(employee.picture) });
      } else {
        setEmployee({ ...employee });
      }
      alert('Update succesfully');
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
