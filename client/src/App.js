import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import NotePage from './components/NotePage';
import "./App.css";
import Counter from "./Counter";

const App = () => {
  const [accessToken, setAccessToken] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleLogin = async (username, password, accessToken) => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setShowLoginForm(false);
      } else {
        console.error('Błąd logowania');
      }
    } catch (error) {
      console.error('Wystąpił błąd podczas logowania', error);
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setShowRegisterForm(false);
      } else {
        console.error('Błąd rejestracji');
      }
    } catch (error) {
      console.error('Wystąpił błąd podczas rejestracji', error);
    }
  };

  const handleAddNote = async (note) => {
    try {
      const response = await fetch('http://localhost:3001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(note),
      });

      if (response.ok) {
        console.log('Dodano notatkę');
        // Tutaj możesz dodać odpowiednią logikę, jeśli chcesz zaktualizować listę notatek itp.
      } else {
        console.error('Błąd dodawania notatki');
      }
    } catch (error) {
      console.error('Wystąpił błąd podczas dodawania notatki', error);
    }
  };

  return (
    
    <div>
      <h1>Aplikacja notatek online</h1>
      {showLoginForm && (
        <LoginForm handleLogin={handleLogin} setShowLoginForm={setShowLoginForm} />
      )}
      {showRegisterForm && (
        <RegisterForm handleRegister={handleRegister} setShowRegisterForm={setShowRegisterForm} />
      )}
      {!showLoginForm && !showRegisterForm && !accessToken && (
        <div className="mt-5 px-3 py-4 border d-flex flex-column align-items-center">
            <h2 className="h2 display-2">Witaj! Wybierz jedną z opcji:</h2>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary btn-lg mx-3 px-5 py-3 mt-2" onClick={() => setShowLoginForm(true)}>Zaloguj</button>
              <button className="btn btn-primary btn-lg mx-3 px-5 py-3 mt-2" onClick={() => setShowRegisterForm(true)}>Zarejestruj</button>
            </div>
        </div>

      )}
      {accessToken && <NotePage token={accessToken} handleAddNote={handleAddNote} />}
    </div>
  );
};

export default App;
