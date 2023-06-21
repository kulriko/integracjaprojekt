import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import NotePage from './components/NotePage';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import './components/Style.css';


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
        setUsername(username);
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
    <>
      {showLoginForm && (
        <LoginForm
          handleLogin={handleLogin}
          setShowLoginForm={setShowLoginForm}
        />
      )}
      {showRegisterForm && (
        <RegisterForm
          handleRegister={handleRegister}
          setShowRegisterForm={setShowRegisterForm}
        />
      )}
      {!showLoginForm && !showRegisterForm && !accessToken && (
        <Navbar expand="lg" style={{ backgroundColor: "#F7D65A" }}>
          <Container>
            <Navbar.Brand>
              <img height="30" className="d-block w-100" src={require('./images/logo-no-background.png')} alt="NoteIt logo" />
            </Navbar.Brand>
            <Navbar.Toggle className="mb-2" aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Button variant="primary" className="text-white fw-bold text-with-outline mt-2 me-2 mb-2" href ="#register" onClick={() => setShowRegisterForm(true)}>
                  Zarejestruj się
                  </Button>{' '}
                <Button variant="primary" className="text-white fw-bold text-with-outline mt-2 me-2 mb-2" href="#login" onClick={() => setShowLoginForm(true)}>
                  Zaloguj się
                  </Button>{' '}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
      <>
        {!showLoginForm && !showRegisterForm && !accessToken && (
          <Carousel style={{ maxWidth: '1500px', height: '750px', margin: '0 auto'}}>
            <Carousel.Item interval={25000}>
              <img
                className="d-block w-100 img-fluid"
                style={{ height: '100%', objectFit: 'cover' }}
                src={require('./images/1.jpg')}
                alt="First slide"
              />
              <Carousel.Caption 
              className = "text-with-outline"
              style={{textAlign: 'center',
              position: 'absolute',
              bottom: '50%',
              left: '50%',
              transform: 'translate(-50%, 50%)'}}>
                <h3>Zapisz swoje notatki</h3>
                <p>Nasza strona umożliwia zapisywanie notatek.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={2500}>
              <img
                className="d-block w-100 img-fluid"
                style={{ height: '100%', objectFit: 'cover' }}
                src={require('./images/2.jpg')}
                alt="Second slide"
              />
              <Carousel.Caption 
              className = "text-with-outline"
              style={{textAlign: 'center',
              position: 'absolute',
              bottom: '50%',
              left: '50%',
              transform: 'translate(-50%, 50%)'}}>
                <h3>Edytuj swoje notatki</h3>
                <p>Nasza strona umożliwia edytowanie notatek.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
            <img
                className="d-block w-100 img-fluid"
                style={{ height: '100%', objectFit: 'cover' }}
                src={require('./images/3.jpg')}
                alt="Second slide"
              />
              <Carousel.Caption 
              className = "text-with-outline"
              style={{textAlign: 'center',
              position: 'absolute',
              bottom: '50%',
              left: '50%',
              transform: 'translate(-50%, 50%)'}}>
                <h3>Usuwaj niepotrzebne notatki.</h3>
                <p>
                  Nasza strona umożliwia usuwanie notatek.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        )}
        {accessToken && <NotePage token={accessToken} handleAddNote={handleAddNote} notes={notes} username={username} />}
      </>
    </>

  );
};

export default App;
