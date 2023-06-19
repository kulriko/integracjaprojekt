import React, { useEffect, useState } from 'react';
import NoteList from './NoteList';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

const NotePage = ({ token, handleAddNote, username }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/notes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotes(data);
        } else {
          console.error('Błąd pobierania notatek');
        }
      } catch (error) {
        console.error('Wystąpił błąd podczas pobierania notatek', error);
      }
    };

    fetchNotes();
  }, [token]);

  const handleAddNoteAndUpdateList = async (note) => {
    await handleAddNote(note);
    fetch('http://localhost:3001/api/notes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((error) => console.log(error));
  };

  const handleLogout = () => {
    // Usunięcie tokena uwierzytelniającego (np. token JWT)
    localStorage.removeItem('token');
    // Odświeżenie strony
    window.location.reload();
  };

  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: '#F7D65A' }}>
        <Container>
          <Navbar.Brand>
            <img height="30" className="d-block w-100"
              src={require('../images/logo-no-background.png')}
              alt="NoteIt logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle className = "mb-2" aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
            <Button variant="danger" className="text-white fw-bold text-with-outline mt-2 me-2 mb-2" onClick={handleLogout}>
              Wyloguj
              </Button>{' '}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div>
        <NoteList
          notes={notes}
          username={username}
          accessToken={token}
          handleAddNote={handleAddNoteAndUpdateList}
        />
      </div>
    </>
  );
};

export default NotePage;
