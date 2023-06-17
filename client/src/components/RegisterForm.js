import React, { useState } from 'react';

const RegisterForm = ({ handleRegister, setShowRegisterForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Wywołanie funkcji handleRegister z przekazaniem danych rejestracji
    try {
      await handleRegister(username, password);
      // Rejestracja udana, można wyczyścić formularz
      setUsername('');
      setPassword('');
    } catch (error) {
      console.log('Błąd rejestracji:', error);
    }
  };

  return (
    <div>
      <h2>Formularz rejestracji</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nazwa użytkownika:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Hasło:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Zarejestruj</button>
      </form>
      <button onClick={() => setShowRegisterForm(false)}>Anuluj</button>
    </div>
  );
};

export default RegisterForm;
