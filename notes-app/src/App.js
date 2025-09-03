import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiURL = "https://notes-backend-161w.onrender.com/notes/";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await axios.get(apiURL);
    setNotes(res.data);
  };

  const createNote = async () => {
    if (!title || !content) return alert("Please enter title and content");
    await axios.post(apiURL, { id: "", title, content });
    setTitle("");
    setContent("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(apiURL + id);
    fetchNotes();
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const updateNote = async () => {
    if (!title || !content) return alert("Please enter title and content");
    await axios.put(apiURL + editingId, { id: editingId, title, content });
    setEditingId(null);
    setTitle("");
    setContent("");
    fetchNotes();
  };

  const shareNote = (note) => {
    const shareURL = `${window.location.origin}/share/${note.id}`;
    alert(`Share this URL: ${shareURL}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Simple Notes App</h1>
      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      /><br /><br />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
      /><br /><br />
      {editingId ? (
        <>
          <button onClick={updateNote}>Update Note</button>
          <button onClick={() => { setEditingId(null); setTitle(""); setContent(""); }}>Cancel</button>
        </>
      ) : (
        <button onClick={createNote}>Add Note</button>
      )}
      <hr />
      <ul>
        {notes.map(note => (
          <li key={note.id} style={{ marginBottom: '1rem' }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => startEdit(note)}>Edit</button>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
            <button onClick={() => shareNote(note)}>Share</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
