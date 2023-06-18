import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import NotePage from './components/NotePage';


const App = () => {
  const [accessToken, setAccessToken] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState('');

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
        setUsername(username);
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
      //console.log("note: ", note);
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
        const newNote = await response.json();
        setNotes((prevNotes) => [...prevNotes, newNote]);
        //console.log("newnote: ", newNote);
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
<<<<<<< HEAD
        <div>
          <p>Witaj! Wybierz jedną z opcji:</p>
          <button onClick={() => setShowLoginForm(true)}>Zaloguj</button>
          <button onClick={() => setShowRegisterForm(true)}>Zarejestruj</button>
=======
        <div className="mt-5 px-3 py-4 border d-flex flex-column align-items-center">
            <h2 className="h2 display-2">Witaj! Zaloguj się, bądź zarejestruj.</h2>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary btn-lg mx-3 px-5 py-3 mt-5" onClick={() => setShowLoginForm(true)}>Zaloguj</button>
              <button className="btn btn-primary btn-lg mx-3 px-5 py-3 mt-5" onClick={() => setShowRegisterForm(true)}>Zarejestruj</button>
            </div>
>>>>>>> 62d41e5125a9629023e82df7fbf54b2cfffe6c1a
        </div>
      )}
      {accessToken && <NotePage token={accessToken} handleAddNote={handleAddNote} notes={notes} username={username} />}
    </div>
  );
};

export default App;
