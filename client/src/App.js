import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import NotePage from './components/NotePage';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Carousel from 'react-bootstrap/Carousel';


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
    <>
    {showLoginForm && (
          <LoginForm handleLogin={handleLogin} setShowLoginForm={setShowLoginForm} />
        )}
        {showRegisterForm && (
          <RegisterForm handleRegister={handleRegister} setShowRegisterForm={setShowRegisterForm} />
        )}
        {!showLoginForm && !showRegisterForm && !accessToken && (
      <Navbar expand="lg" style={{backgroundColor: "#4f9ee5"}}>
        <Container>
          <Navbar.Brand>NoteIt</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#login" onClick={() => setShowLoginForm(true)}>Zaloguj się</Nav.Link>
              <Nav.Link href="#link" onClick={() => setShowRegisterForm(true)}>Zarejestruj się</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
        )}
        {accessToken && <NotePage token={accessToken} handleAddNote={handleAddNote} notes={notes} username={username} />}
        <>
        {!showLoginForm && !showRegisterForm && !accessToken && (
        <Carousel>
      <Carousel.Item interval={2500}>
        <img height = "600"
          className="d-block w-100"
          src={require('./images/1.jpg')}
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2500}>
        <img height = "600"
          className="d-block w-100"
          src={require('./images/2.jpg')}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img height = "600"
          className="d-block w-100"
          src={require('./images/3.jpg')}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
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
