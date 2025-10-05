import React from 'react'
import axios from 'axios';
import DragDrop from './Drag-Drop'

const STORAGE_KEY = 'user_notes'

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

export default function Notes({ onLogout }) {
  const [notes, setNotes] = React.useState(() => loadNotes())
  const [savedAt, setSavedAt] = React.useState(() => localStorage.getItem(STORAGE_KEY + ':ts'))
  const [expandedIds, setExpandedIds] = React.useState(() => [])
  const [showDrop, setShowDrop] = React.useState(false)

  const persist = (items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      const ts = new Date().toISOString()
      localStorage.setItem(STORAGE_KEY + ':ts', ts)
      setSavedAt(ts)
    } catch (e) {
      // ignore
    }
  }

  const handleGenerated = (text, title) => {
    const newNote = {
      id: Date.now() + Math.random(),
      title: title || 'New Note from AI',
      text: text,
      ts: new Date().toISOString(),
    }
    const next = [newNote, ...notes]
    setNotes(next)
    persist(next)
    setShowDrop(false)
  }

  const deleteNote = (id) => {
    const next = notes.filter(n => n.id !== id)
    setNotes(next)
    persist(next)
    setExpandedIds(prev => prev.filter(eId => eId !== id)) // Also collapse if deleted
  }

  // *** NEW FUNCTION: TOGGLES EXPANSION ***
  const toggleExpansion = (id) => {
    setExpandedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(eId => eId !== id) // Collapse
      } else {
        return [...prev, id] // Expand
      }
    })
  }
  // ****************************************

  return (
    <div className="notes-container">
      <style>{`
        .notes-container { padding: 10px; }
        .notes-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .notes-list { list-style: none; padding: 0; }
        .note-item { 
          border: 1px solid #ddd; 
          border-radius: 8px; 
          margin-bottom: 10px; 
          background: #fff; 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          padding: 15px;
        }
        .note-body { 
          flex-grow: 1; 
          cursor: pointer; /* Indicate it's clickable */
        }
        .note-title { 
          font-weight: bold; 
          font-size: 1.1em; 
          margin-bottom: 5px; 
        }
        .note-text { 
          white-space: pre-wrap; 
          max-height: 200px; /* Limit height when expanded for long text */
          overflow: auto;
          margin-top: 10px;
          color: #333;
        }
        .note-ts { 
          font-size: 0.75em; 
          color: #999; 
          margin-top: 8px; 
        }
        .note-empty { 
          text-align: center; 
          color: #666; 
          padding: 20px; 
          border: 1px dashed #ccc; 
          border-radius: 6px; 
        }
        .action-area { 
          display: flex; 
          flex-direction: column; 
          gap: 8px; 
          margin-left: 20px;
        }
      `}</style>
      
      <div className="notes-action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setShowDrop(prev => !prev)}>{showDrop ? 'Hide Importer' : 'Import File & Generate Note'}</button>
        {typeof onLogout === 'function' && (
          <button className="nav-btn" onClick={onLogout}>Log Out</button>
        )}
      </div>

      {showDrop && (
        <div style={{ marginTop: 12 }}>
          <DragDrop onGenerated={handleGenerated} onClose={() => setShowDrop(false)} />
        </div>
      )}

      <div className="notes-header">
        <h3>Your saved notes</h3>
        <div className="notes-meta">{notes.length ? `${notes.length} notes` : 'No saved notes'}</div>
      </div>

      <ul className="notes-list">
        {notes.length === 0 && <li className="note-empty">No notes yet — Import your notes here.</li>}
        {notes.map((n) => {
          const expanded = expandedIds.includes(n.id)
          return (
            <li key={n.id} className="note-item">
              {/* *** MODIFICATION: ADDED onClick HANDLER *** */}
              <div className="note-body" onClick={() => toggleExpansion(n.id)}> 
                {n.title && <div className="note-title">{n.title}</div>}
                {expanded ? (
                  <>
                    <div className="note-text">{n.text}</div>
                    <div className="note-ts">Saved: {new Date(n.ts).toLocaleString()}</div>
                  </>
                ) : (
                  <div style={{ color: '#666', fontStyle: 'italic', fontSize: '0.9em' }}>
                    Click to view full content ({n.text.length} characters)
                  </div>
                )}
              </div>
              {/* *** END MODIFICATION *** */}
              
              <div className="action-area">
                <button className="remove-btn" onClick={() => deleteNote(n.id)}>Delete</button>
                {/* Optional: Add a separate button to toggle expansion if you want */}
                <button onClick={() => toggleExpansion(n.id)}>
                    {expanded ? 'Collapse' : 'Expand'}
                </button>
              </div>
            </li>
          )
        })}
      </ul>
      <p style={{ fontSize: '0.8em', color: '#999', marginTop: 20 }}>Last saved: {savedAt ? new Date(savedAt).toLocaleString() : 'Never'}</p>
    </div>
  )
}