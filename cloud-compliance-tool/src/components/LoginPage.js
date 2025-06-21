// src/components/LoginPage.js
import React, { useState } from 'react';
import './LoginPage.css'; // We'll create this CSS file next

function LoginPage({ onLoginSuccess }) {
  // These are "state variables" to store what the user types in the input fields.
  // `username` holds the current value, `setUsername` is a function to change it.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    // This stops the browser from refreshing the page when the form is submitted
    event.preventDefault();

    // --- IMPORTANT: This is where real login logic would go later ---
    // For now, let's do a very simple check.
    // In a real app, you'd send username/password to your backend here.
    if (username === 'user' && password === 'password') {
      setError(''); // Clear any previous errors
      onLoginSuccess(); // Call the function passed from App.js to indicate success
      alert('Login successful! (Mock Login)');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Cloud Compliance Tool</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state as user types
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state as user types
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default LoginPage; // This makes our component available to other files