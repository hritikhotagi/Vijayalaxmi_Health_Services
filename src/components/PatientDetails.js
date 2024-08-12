import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PatientDetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
    setPatient(storedPatients[id]);
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="details-container2 container mt-5">
      <h2>Patient Details</h2>
      <p><strong>UID:</strong> {patient.uid}</p>
      <p><strong>Name:</strong> {patient.name}</p>
      <p><strong>Phone Number:</strong> {patient.phoneNumber}</p>
      <p><strong>Age:</strong> {patient.age}</p>
      <p><strong>BP:</strong> {patient.bp}</p>
      <p><strong>Sugar:</strong> {patient.sugar}</p>
      {patient.images && patient.images.length > 0 && (
        <div>
          <strong>Images:</strong>
          {patient.images.map((image, index) => (
            <img key={index} src={image} alt={`Patient ${index}`} className="img-thumbnail" />
          ))}
        </div>
      )}
      <button className="btn btn-primary mt-3 ms-2" onClick={() => navigate(`/edit/${id}`)}>Edit</button>
      <button className="btn btn-secondary mt-3" onClick={() => navigate('/home')}>Back</button>
    </div>
  );
}

export default PatientDetails;
