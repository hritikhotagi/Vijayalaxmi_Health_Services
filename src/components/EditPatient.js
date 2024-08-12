import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Compressor from 'compressorjs';
import CryptoJS from 'crypto-js';
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
    images: [],
    gender: '',
    weight: '',
    height: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
    setPatient(storedPatients[id]);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Enforce max length for phoneNumber and age fields
    if (name === 'phoneNumber' && value.length > 10) return;
    if (name === 'age' && value.length > 3) return;

    setPatient({ ...patient, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const compressedFiles = [];

    files.forEach((file) => {
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          const reader = new FileReader();
          reader.readAsDataURL(result);
          reader.onload = () => {
            const encrypted = CryptoJS.AES.encrypt(reader.result, 'secret-key').toString();
            compressedFiles.push(encrypted);
            if (compressedFiles.length === files.length) {
              setPatient({ ...patient, images: compressedFiles });
            }
          };
        },
      });
    });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = patient.name ? "" : "Name is required";
    tempErrors.phoneNumber = patient.phoneNumber ? 
      (/^\d{10}$/.test(patient.phoneNumber) ? "" : "Phone Number must be 10 digits") 
      : "Phone Number is required";
    tempErrors.age = patient.age ? 
      (patient.age <= 100 ? "" : "Age cannot be more than 100") 
      : "Age is required";
    tempErrors.gender = patient.gender ? "" : "Gender is required";
    if (patient.bp && !/^\d{2,3}\/\d{2,3}$/.test(patient.bp)) {
      tempErrors.bp = "BP should be in format e.g. 120/80";
    }
    if (patient.sugar && !/^\d{1,3}$/.test(patient.sugar)) {
      tempErrors.sugar = "Sugar should be a valid number";
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const data = { ...patient };
      console.log('Data to be sent to backend:', data); // Console log the data
      const response = await fetch('https://your-backend-api.com/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
        storedPatients[id] = patient;
        localStorage.setItem('patients', JSON.stringify(storedPatients));
        navigate(`/patient/${id}`);
      } else {
        console.error('Failed to edit data');
      }
    }
  };

  return (
    <div className="edit-container container mt-5">
      <h2>Edit Patient Details</h2>
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
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number (required)</label>
          <input
            type="text"
            className="form-control"
            id="phoneNumber"
            name="phoneNumber"
            value={patient.phoneNumber}
            onChange={handleChange}
            placeholder="1234567890"
            maxLength="10"
            required
          />
          {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Age (required)</label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={patient.age}
            onChange={handleChange}
            placeholder="Enter age up to 100"
            required
          />
          {errors.age && <div className="text-danger">{errors.age}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Gender (required)</label>
          <select
            className="form-control"
            id="gender"
            name="gender"
            value={patient.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <div className="text-danger">{errors.gender}</div>}
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
            placeholder="120/80"
          />
          {errors.bp && <div className="text-danger">{errors.bp}</div>}
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
            placeholder="e.g. 90"
          />
          {errors.sugar && <div className="text-danger">{errors.sugar}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="weight" className="form-label">Weight (kg)</label>
          <input
            type="number"
            className="form-control"
            id="weight"
            name="weight"
            value={patient.weight}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="height" className="form-label">Height (cm)</label>
          <input
            type="number"
            className="form-control"
            id="height"
            name="height"
            value={patient.height}
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
