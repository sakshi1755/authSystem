import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Register form submitted:', { name, email, password });
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      console.log('Registration successful, navigating to login');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <form className="flex-auto" onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted:', { email, password });
    try {
      await axios.post('http://localhost:5000/api/auth/login', { email, password },{ withCredentials: true });
      console.log('Login successful, navigating to home');
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
     //   const token = localStorage.getItem('authToken',{ withCredentials: true }); // or from cookies
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          // headers: {
          //   'Authorization': `Bearer ${token}`,
          // },
          withCredentials: true, // Ensure cookies are included
        });
        console.log('User fetched:', response.data);
        setUser(response.data.username);
      } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message);
        // navigate('/login');
      }
    };
    
    fetchUser();
  }, [navigate]);

  const logout = async () => {
    console.log('Logging out');
    await axios.post('http://localhost:5000/api/auth/logout',{ withCredentials: true });
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome, {user ? `User ${user}` : 'Loading...'}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
