from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import uuid

app = FastAPI()

# Allow CORS for React frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Note(BaseModel):
    id: str
    title: str
    content: str

notes = []

# Create Note
@app.post("/notes/", response_model=Note)
def create_note(note: Note):
    note.id = str(uuid.uuid4())  # generate unique id for each note
    notes.append(note)
    return note

# Read all Notes
@app.get("/notes/", response_model=List[Note])
def read_notes():
    return notes

# Read Note by ID
@app.get("/notes/{note_id}", response_model=Note)
def read_note(note_id: str):
    for note in notes:
        if note.id == note_id:
            return note
    raise HTTPException(status_code=404, detail="Note not found")

# Update Note
@app.put("/notes/{note_id}", response_model=Note)
def update_note(note_id: str, updated_note: Note):
    for index, note in enumerate(notes):
        if note.id == note_id:
            notes[index] = updated_note
            return updated_note
    raise HTTPException(status_code=404, detail="Note not found")

# Delete Note
@app.delete("/notes/{note_id}")
def delete_note(note_id: str):
    for index, note in enumerate(notes):
        if note.id == note_id:
            notes.pop(index)
            return {"detail": "Note deleted"}
    raise HTTPException(status_code=404, detail="Note not found")