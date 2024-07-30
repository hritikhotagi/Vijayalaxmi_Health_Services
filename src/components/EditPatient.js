import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPatient.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditPatient() {
  const { id } = useParams();
  const [patient, setPatient] = useState({
    name: '',
    phoneNumber: '',
    age: '',
    bp: '',
    sugar: '',
    images: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
    setPatient(storedPatients[id]);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setPatient({ ...patient, images: files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
    storedPatients[id] = patient;
    localStorage.setItem('patients', JSON.stringify(storedPatients));
    navigate(`/patient/${id}`);
  };

  return (
    <div className="edit-container container mt-5">
      <h2>Edit Patient Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={patient.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            id="phoneNumber"
            name="phoneNumber"
            value={patient.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Age</label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={patient.age}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bp" className="form-label">BP</label>
          <input
            type="text"
            className="form-control"
            id="bp"
            name="bp"
            value={patient.bp}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="sugar" className="form-label">Sugar</label>
          <input
            type="text"
            className="form-control"
            id="sugar"
            name="sugar"
            value={patient.sugar}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">Images</label>
          <input
            type="file"
            className="form-control"
            id="images"
            multiple
            onChange={handleImageUpload}
          />
          <div className="mt-2">
            {patient.images.map((image, index) => (
              <img key={index} src={image} alt={`Patient ${index}`} className="img-thumbnail" />
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(`/patient/${id}`)}>Cancel</button>
      </form>
    </div>
  );
}

export default EditPatient;
