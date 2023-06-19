import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

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
    <>
    <Navbar expand="lg" style={{backgroundColor: "#4f9ee5"}}>
      <Container>
        <Navbar.Brand>NoteIt</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <div className="mt-5 px-3 py-4 border d-flex flex-column align-items-center justify-content-center">
      <h2 className="h2 display-3">Formularz logowania</h2>
      <form onSubmit={handleSubmit}>
      <div className="d-flex flex-column mb-2">
        <label className="small-label" htmlFor="username">
          Nazwa użytkownika:
        </label>
          <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="d-flex flex-column mb-2">
        <label className="small-label" htmlFor="password">
        Hasło:
        </label>
          <input
          type="password"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="d-flex justify-content-between w-100">
        <button type="submit" className="mr-2">Zaloguj</button>
        <button onClick={() => setShowLoginForm(false)}>Anuluj</button>
        </div>
      </form>
    </div>
    </>
  );
};

export default LoginForm;
