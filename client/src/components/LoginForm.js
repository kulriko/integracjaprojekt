import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

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
      <Navbar expand="lg" style={{backgroundColor: "#F7D65A"}}>
        <Container>
          <Navbar.Brand>
            <img height = "30" className="d-block w-100" src={require('../images/logo-no-background.png')} alt="NoteIt logo"/>
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="mt-3 form-border mx-auto w-50">
        <Form onSubmit={handleSubmit} className="text-left">
        <Form.Label><h2>Zaloguj się:</h2></Form.Label>
        <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "10px" }}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Nazwa użytkownika:</Form.Label>
            <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder = "Login"/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Hasło:</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Hasło" />
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button className="me-2" variant="primary" type="submit">
              Zaloguj się
            </Button>
            <Button className="me-2" onClick={() => setShowLoginForm(false)} variant="secondary" type="submit">
              Anuluj
            </Button>
          </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
