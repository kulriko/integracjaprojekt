import React, { useState } from 'react';

const NoteList = ({ notes, accessToken, handleAddNote }) => {
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editedNote, setEditedNote] = useState({ id: '', title: '', content: '' });
  const [deletedNote, setDeletedNote] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const [notesList, setNotes] = React.useState(notes);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditedNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const handleAddNoteClick = () => {
    handleAddNote(newNote);
  };

  const handleEditNote = (note) => {
    setEditedNote({ id: note._id, title: note.title, content: note.content });
  };

  const handleUpdateNote = () => {
    fetch(`http://localhost:3001/api/notes/${editedNote.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedNote),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedNotes = notes.map((note) =>
          note._id === data._id ? data : note
        );
        setNotes((prevNotes) => [...prevNotes, newNote]);
        setEditedNote({ id: '', title: '', content: '' });
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteNote = (note) => {
    setDeletedNote(note);
  };

  const handleConfirmDelete = () => {
    fetch(`http://localhost:3001/api/notes/${deletedNote._id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const updatedNotes = notes.filter((note) => note._id !== deletedNote._id);
          setNotes((prevNotes) => [...prevNotes, newNote]);
          setDeletedNote(null);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h2>Lista notatek</h2>
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
      {notes.map((note) => {
        if (note.userId === accessToken) {
          return (
            <div key={note._id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button onClick={() => handleEditNote(note)}>Edytuj</button>
              <button onClick={() => handleDeleteNote(note)}>Usuń</button>
            </div>
          );
        } else {
          return null;
        }
      })}

      {editedNote.id && (
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
      {deletedNote && (
        <div>
          <p>Czy na pewno chcesz usunąć notatkę "{deletedNote.title}"?</p>
          <button onClick={handleConfirmDelete}>Tak</button>
          <button onClick={() => setDeletedNote(null)}>Anuluj</button>
        </div>
      )}
    </div>
  );
};

export default NoteList;
