import React, { useEffect, useState } from 'react';
import NoteList from './NoteList';

const NotePage = ({ token, handleAddNote }) => { // Dodaj handleAddNote jako argument
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/notes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((error) => console.log(error));
  }, [token]);

  return (
    <div>
      <h2>Strona notatek</h2>
      <NoteList notes={notes} accessToken={token} handleAddNote={handleAddNote} />
    </div>
  );
};

export default NotePage;
