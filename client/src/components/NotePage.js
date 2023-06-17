import React, { useEffect, useState } from 'react';
import NoteList from './NoteList';

const NotePage = ({ token, handleAddNote }) => {
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

  return (
    <div>
      <h2>Strona notatek</h2>
      <NoteList notes={notes} accessToken={token} handleAddNote={handleAddNoteAndUpdateList} />
    </div>
  );
};

export default NotePage;
