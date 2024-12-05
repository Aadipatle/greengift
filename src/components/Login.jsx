import React, { useState, useEffect } from 'react';
import { account } from './appwriteConfig'; // Ensure appwriteConfig is correct
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const checkSession = async () => {
    try {
      const user = await account.get(); // Check if user is logged in
      if (user) {
        alert('User is already logged in.');
        navigate('/'); // Redirect if already logged in
      }
    } catch (error) {
      console.error('No active session:', error);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }
  
    console.log("Email:", email, "Password:", password); // Log email and password for debugging
  
    try {
      // Correctly creating session with email and password
      const response = await account.createSession(email, password);
      setUser(response);  // Set the logged-in user
      alert('Login successful!');
      navigate('/');  // Redirect to home or product page
    } catch (error) {
      console.error('Login failed:', error); // Log the error directly
      setErrorMessage('Login failed. Please check your credentials.'); // Set error message
    }
  };
  return (
    <div style={{ marginTop: '200px' }}>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
