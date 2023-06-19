import React, { useState, useEffect } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

const NoteList = ({ notes, username, handleAddNote, accessToken }) => {
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editedNote, setEditedNote] = useState({ id: '', title: '', content: '' });
  const [deletedNote, setDeletedNote] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const [notesList, setNotesList] = useState(notes);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedDeleteNoteId, setSelectedDeleteNoteId] = useState(null);

  useEffect(() => {
    setNotesList(notes);
  }, [notes]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditedNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const handleAddNoteClick = () => {
    const note = { ...newNote };
    handleAddNote(note);
    setNewNote({ title: '', content: '' });
  };

  const handleEditNote = (note) => {
    setEditedNote({ id: note._id, title: note.title, content: note.content });
    setSelectedNoteId(note._id);
    setSelectedDeleteNoteId(null);
  };

  const handleUpdateNote = () => {
    fetch(`http://localhost:3001/api/notes/${editedNote.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(editedNote),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedNotes = notesList.map((note) =>
          note._id === data._id ? data : note
        );
        setNotesList(updatedNotes);
        setEditedNote({ id: '', title: '', content: '' });
        setSelectedNoteId(null);
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteNote = (note) => {
    setDeletedNote(note);
    setSelectedDeleteNoteId(note._id);
    setSelectedNoteId(null);
  };

  const handleConfirmDelete = () => {
    fetch(`http://localhost:3001/api/notes/${deletedNote._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        const updatedNotes = notesList.filter(
          (note) => note._id !== deletedNote._id
        );
        setNotesList(updatedNotes);
        setDeletedNote(null);
        setSelectedDeleteNoteId(null);
      })
      .catch((error) => console.log(error));
  };

  const handleCancelEdit = () => {
    setEditedNote({ id: '', title: '', content: '' });
    setSelectedNoteId(null);
  };

  return (
    <>
      <div className="mt-3 form-border mx-auto w-50">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Tytuł notatki:</Form.Label>
            <Form.Control
              placeholder="Tytuł"
              aria-label="Tytuł notatki: "
              type="text"
              name="title"
              placeholder="Tytuł"
              value={newNote.title}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Treść notatki:</Form.Label>
            <Form.Control
              placeholder="Treść"
              as="textarea"
              rows={3}
              name="content"
              placeholder="Treść"
              value={newNote.content}
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-left">
            <Button onClick={handleAddNoteClick} className="me-2" variant="primary">
              Dodaj notatkę
            </Button>
          </div>
        </Form>
      </div>
      <div className="mt-3 mx-auto" style={{ width: '60%' }}>
      <Accordion defaultActiveKey="0" className="d-inline-block w-100">
        {notesList.map((note, index) => {
          if (note.username === username) {
            return (
              <Accordion.Item eventKey={index.toString()} key={note._id}>
                <Accordion.Header>{note.title}</Accordion.Header>
                <Accordion.Body>
                
                  <p>{note.content}</p>
                  <Button onClick={() => handleEditNote(note)} className="me-2" variant="success">
                  Edytuj
                  </Button>
                  <Button onClick={() => handleDeleteNote(note)}className="me-2" variant="danger">
                  Usuń
                  </Button>
                
                  {selectedNoteId === note._id && (
                    <>
                      <div className="mt-3 form-border mx-auto w-50">
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label>Tytuł notatki:</Form.Label>
                            <Form.Control
                              placeholder="Tytuł"
                              aria-label="Tytuł notatki: "
                              type="text"
                              name="title"
                              value={editedNote.title}
                              onChange={handleEditInputChange}
                            />
                          </Form.Group>
                        </Form>
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label>Treść notatki:</Form.Label>
                            <Form.Control
                              placeholder="Treść"
                              as="textarea"
                              rows={3}
                              name="content"
                              placeholder="Treść"
                              value={editedNote.content}
                              onChange={handleEditInputChange}
                            />
                          </Form.Group>
                        </Form>
                      </div>
                      <div className="d-flex justify-content-center">
                      <Button onClick={handleUpdateNote} className="me-2" variant="success">
                        Zapisz zmiany
                      </Button>
                      <Button onClick={handleCancelEdit} className="me-2" variant="secondary">
                        Anuluj
                      </Button>
                      </div>
                    </>
                  )}
                  {selectedDeleteNoteId === note._id && (
                    <>
                      <div className="text-center">
                        <p>Czy na pewno chcesz usunąć notatkę "{note.title}"?</p>
                      </div>
                      <div className="d-flex justify-content-center">
                        <Button onClick={handleConfirmDelete} className="me-2" variant="danger">
                        Tak
                        </Button>
                        <Button onClick={() => setSelectedDeleteNoteId(null)} className="me-2" variant="secondary">
                          Anuluj
                          </Button>
                      </div>
                    </>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            );
          } else {
            return null;
          }
        })}
      </Accordion>
      </div>
    </>
  );
};

export default NoteList;
