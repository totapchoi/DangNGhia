import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import './EmployeeForm.css';



function EmployeeForm({
  employee,
  setEmployee,
  handleSubmit,
  formTitle,
  submitButtonText
}) {
  return (
    <div>
      <h1>{formTitle}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Employee Name"
          value={employee.name}
          onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
          required
          pattern="\S+.*"
          className="input-field"
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
        <button type="submit">{submitButtonText}</button>
      </form>
    </div>
  );
}

export default EmployeeForm;
