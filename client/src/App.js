import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import NotePage from './components/NotePage';

const App = () => {
  const [accessToken, setAccessToken] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [notes, setNotes] = useState([]); // Dodaj stan 'notes' i funkcję 'setNotes'

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
        const token = data.accessToken;
        setAccessToken({ username, token }); // Ustaw poprawnie obiekt accessToken
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
        console.log("note");
        console.log(note);
        console.log("ne");
        console.log('Dodano notatkę');
        const newNote = await response.json();
        console.log("newnote");
        console.log(newNote);
        console.log("newew");
        setNotes((prevNotes) => [...prevNotes, newNote]);
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
        <div>
          <p>Witaj! Wybierz jedną z opcji:</p>
          <button onClick={() => setShowLoginForm(true)}>Zaloguj</button>
          <button onClick={() => setShowRegisterForm(true)}>Zarejestruj</button>
        </div>
      )}
      {accessToken && <NotePage token={accessToken} handleAddNote={handleAddNote} notes={notes} />}
    </div>
  );
};

export default App;
