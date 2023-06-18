import React, { useState } from 'react';

const LoginForm = ({ handleLogin, setShowLoginForm}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const { accessToken } = await response.json();
        // Przekazanie tokena do funkcji handleLogin przekazanej przez komponent App
        handleLogin(username, password, accessToken);
      } else {
        console.log('Błędne dane logowania');
      }
    } catch (error) {
      console.log('Wystąpił błąd podczas logowania:', error);
    }
  };

  return (
    <div>
      <h2>Formularz logowania</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nazwa użytkownika:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Hasło:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Zaloguj</button>
      </form>
      <button onClick={() => setShowLoginForm(false)}>Anuluj</button>
    </div>
  );
};

export default LoginForm;
