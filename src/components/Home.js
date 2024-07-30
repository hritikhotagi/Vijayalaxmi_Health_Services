import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdOutlineLogout } from "react-icons/md";
import img from '../assets/img.png';


function Home() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
    setPatients(storedPatients);
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.uid.toString().includes(search)
  );

  return (
    <div className="home-container container">
      <div className="d-flex justify-content-between align-items-center nav">
        <h2 className="subtitle">Patient Details</h2>
        <button className="btn logout" onClick={() => { logout(); navigate('/'); }}><MdOutlineLogout /></button>
      </div>
      <div className="features">
        <button className="btn btn-success" onClick={() => navigate('/upload')}>
          <h4>New Patient</h4>
        </button>
      </div>
      <input
        type="text"
        className="form-control mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or UID"
      />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>UID</th>
            <th>Name</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient, index) => (
            <tr key={index} onClick={() => navigate(`/patient/${index}`)}>
              <td>{patient.uid}</td>
              <td>{patient.name}</td>
              <td>{patient.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
