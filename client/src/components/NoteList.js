import React, { useState, useEffect } from 'react';

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

  return (
    <div>
      <h2>Nowa notatka:</h2>
      <div>
        <input
          type="text"
          name="title"
          placeholder="Tytuł"
          value={newNote.title}
          onChange={handleInputChange}
        />
        <textarea
          name="content"
          placeholder="Treść"
          value={newNote.content}
          onChange={handleInputChange}
        ></textarea>
        <button onClick={handleAddNoteClick}>Dodaj notatkę</button>
      </div>
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
                  <button onClick={handleUpdateNote}>Zapisz zmiany</button>
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
  );
};

export default NoteList;
