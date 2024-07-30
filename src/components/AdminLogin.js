import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './AdminLogin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import img from '../assets/img.png';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === 'admin') {
      login();
      navigate('/home');
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className="login-container container mt-5">
      <div className="row justify-content-center">
        <h1 className="title"><span className="dif">Free Health</span> Camp</h1>
        <div className="box">
          <h2>Login</h2>
          <input
            type="password"
            className="form-control mb-8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
      </div>
      <div className="image">
      <img src={img} alt="Decoration" />
      </div>
    </div>
  );
}

export default AdminLogin;
