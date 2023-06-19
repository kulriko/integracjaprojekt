import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

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
    <>
      <Navbar expand="lg" style={{backgroundColor: "#F7D65A"}}>
        <Container>
          <Navbar.Brand>
            <img height = "30" className="d-block w-100" src={require('../images/logo-no-background.png')} alt="NoteIt logo"/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Form className = "ms-auto" onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Nazwa użytkownika: </Form.Label>
        <Form.Control type="text" value={username} onChange={
          (e) => setUsername(e.target.value)}
          placeholder="Login" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Hasło: </Form.Label>
        <Form.Control type="password" value={password}onChange={
          (e) => setPassword(e.target.value)} placeholder="Hasło" />
      </Form.Group>
      <Button className = "me-2" variant="primary" type="submit">
        Zarejestruj
      </Button>
      <Button className = "me-2" onClick={() => setShowRegisterForm(false)} variant="secondary" type="submit">
        Anuluj
      </Button>
    </Form>
          </>
  );
};

export default RegisterForm;
