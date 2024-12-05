import React, { useState } from 'react';
import { account } from './appwriteConfig';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      await account.create('unique()', email, password, name);
      alert('Registration successful! Please log in.');
      navigate('/login')

    } catch (error) {
      console.error(error);
      alert('Registration failed.');
    }
  };

  return (
    <>
    <div className="regi" style={{marginTop:'200px'}}>
    
      <h2>Register</h2>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      </div>
    </>
  );
};

export default Register;
