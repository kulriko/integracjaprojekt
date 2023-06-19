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
        placeholder = "Treść"
        as="textarea"
        rows={3}
        name="content"
        placeholder="Treść"
        value={newNote.content}
        onChange={handleInputChange}
        />
      </Form.Group>
          <div className="d-flex justify-content-left">
            <Button onClick={handleAddNoteClick}className="me-2" variant="primary">
              Dodaj notatkę
            </Button>
          </div>
      </Form>
      </div>
      <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
        {formErrors.length > 0 && (
        <ul>
          {formErrors.map((error) => (
            <li key={error.param}>{error.msg}</li>
          ))}
        </ul>
      )}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Accordion Item #2</Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <div>
      {formErrors.length > 0 && (
        <ul>
          {formErrors.map((error) => (
            <li key={error.param}>{error.msg}</li>
          ))}
        </ul>
      )}
      <br></br>
      <h2>Lista notatek:</h2>
      {notesList.map((note) => {
        if (note.username === username) {
          return (
            <div key={note._id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button onClick={() => handleEditNote(note)}>Edytuj</button>
              <button onClick={() => handleDeleteNote(note)}>Usuń</button>
              {selectedNoteId === note._id && (
                <div>
                  <input
                    type="text"
                    name="title"
                    value={editedNote.title}
                    onChange={handleEditInputChange}
                  />
                  <textarea
                    name="content"
                    value={editedNote.content}
                    onChange={handleEditInputChange}
                  ></textarea>
                  <br></br>
                  <button onClick={handleUpdateNote}>Zapisz zmiany</button>
                  <button onClick={handleCancelEdit}>Anuluj</button>
                </div>
              )}
              {selectedDeleteNoteId === note._id && (
                <div>
                  <p>Czy na pewno chcesz usunąć notatkę "{note.title}"?</p>
                  <button onClick={handleConfirmDelete}>Tak</button>
                  <button onClick={() => setSelectedDeleteNoteId(null)}>Anuluj</button>
                </div>
              )}
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
    </>
  );
};

export default NoteList;
