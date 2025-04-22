import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,
 {
        email,
        password,
      });
  
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.user.name); // Save name
        alert('Login successful');
        navigate('/booklist');
      }
    } catch (err) {
      console.error('Login Error:', err); // Log error for debugging
      if (err.response) {
        alert("Login failed: " + err.response.data.error);
      } else {
        alert("Login failed: Network error");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Login</button>
      </form>
    </div>
  );
}

export default Login;
