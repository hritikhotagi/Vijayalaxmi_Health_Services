import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Upload.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Upload() {
  const { id } = useParams();
  const [patient, setPatient] = useState({
    name: '',
    phoneNumber: '',
    age: '',
    bp: '',
    sugar: '',
    images: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
      setPatient(storedPatients[id] || patient);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setPatient({ ...patient, images: [...patient.images, ...files] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
    if (id) {
      storedPatients[id] = patient;
    } else {
      patient.uid = storedPatients.length + 1;
      storedPatients.push(patient);
    }
    localStorage.setItem('patients', JSON.stringify(storedPatients));
    navigate('/home');
  };

  return (
    <div className="upload-container container mt-5">
      <h2>{id ? 'Edit Patient Details' : 'Upload New Patient'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name (required)</label>
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
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Update' : 'Upload'}</button>
        <button className="btn btn-primary" onClick={() => navigate('/home')}>Back</button>
      </form>
    </div>
  );
}

export default Upload;
