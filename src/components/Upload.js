import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Compressor from 'compressorjs';
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
    gender: '',
    weight: '',
    height: '',
    pulse: '',
    spo2: '',
    temperature: '',
    bmi: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
      setPatient(storedPatients[id] || {});
    }
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
          compressedFiles.push(result);
          if (compressedFiles.length === files.length) {
            setPatient(p => ({ ...p, images: compressedFiles }));
          }
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
      const formData = new FormData();
      formData.append('name', patient.name);
      formData.append('phoneNumber', patient.phoneNumber);
      formData.append('age', patient.age);
      formData.append('bp', patient.bp);
      formData.append('sugar', patient.sugar);
      patient.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image, image.name);
      });
      formData.append('gender', patient.gender);
      formData.append('weight', patient.weight);
      formData.append('height', patient.height);
      formData.append('pulse', patient.pulse);
      formData.append('spo2', patient.spo2);
      formData.append('temperature', patient.temperature);
      formData.append('bmi', patient.bmi);

      // Log the FormData contents
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      try {
        const response = await fetch('https://b5e7-103-197-115-185.ngrok-free.app/create', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
          if (id) {
            storedPatients[id] = patient;
          } else {
            patient.uid = storedPatients.length + 1;
            storedPatients.push(patient);
          }
          localStorage.setItem('patients', JSON.stringify(storedPatients));
          navigate('/home');
        } else {
          console.error('Failed to upload data');
        }
      } catch (error) {
        console.error('Error uploading data:', error);
      }
    }
  };

  return (
    <div className="upload-container container mt-5">
      <h2>{id ? 'Edit Patient Details' : 'Upload New Patient'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
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
          <label htmlFor="pulse" className="form-label">Pulse</label>
          <input
            type="number"
            className="form-control"
            id="pulse"
            name="pulse"
            value={patient.pulse}
            onChange={handleChange}
            placeholder="e.g. 72"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="spo2" className="form-label">SPO2</label>
          <input
            type="number"
            className="form-control"
            id="spo2"
            name="spo2"
            value={patient.spo2}
            onChange={handleChange}
            placeholder="e.g. 98"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="temperature" className="form-label">Temperature (°C)</label>
          <input
            type="number"
            className="form-control"
            id="temperature"
            name="temperature"
            value={patient.temperature}
            onChange={handleChange}
            placeholder="e.g. 37.5"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bmi" className="form-label">BMI</label>
          <input
            type="number"
            className="form-control"
            id="bmi"
            name="bmi"
            value={patient.bmi}
            onChange={handleChange}
            placeholder="e.g. 22.5"
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
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/home')}>Back</button>
      </form>
    </div>
  );
}

export default Upload;
