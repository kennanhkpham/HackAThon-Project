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

  const addSampleNote = () => {
    const sample = {
      id: Date.now() + Math.random(),
      title: 'Note',
      text: `Note — created ${new Date().toLocaleString()}`,
      ts: new Date().toISOString(),
    }
    const next = [sample, ...notes]
    setNotes(next)
    persist(next)
  }

  const handleGenerated = (text, title) => {
    const note = { id: Date.now() + Math.random(), title: title || ((String(text || '')).split('\n')[0].slice(0, 60) || 'Untitled'), text, ts: new Date().toISOString() }
    const next = [note, ...notes]
    setNotes(next)
    persist(next)
    setShowDrop(false)
  }

  const deleteNote = (id) => {
    const next = notes.filter((n) => n.id !== id)
    setNotes(next)
    persist(next)
  }

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      return [...prev, id]
    })
  }

  const clearNotes = () => {
    setNotes([])
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STORAGE_KEY + ':ts')
      setSavedAt(null)
    } catch (e) {}
  }

  const importFromFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = String(ev.target.result || '')
      // try parse JSON array, otherwise split by newlines
      let imported = []
      try {
        const parsed = JSON.parse(text)
        if (Array.isArray(parsed)) {
          imported = parsed.map((t) => {
            const body = typeof t === 'string' ? t : JSON.stringify(t)
            return { id: Date.now() + Math.random(), title: (String(body).split('\n')[0] || 'Imported'), text: body, ts: new Date().toISOString() }
          })
        }
      } catch (e) {
        // treat as newline-separated text
        imported = text.split(/\r?\n/).filter(Boolean).map((t) => ({ id: Date.now() + Math.random(), title: (String(t).slice(0, 60) || 'Imported'), text: t, ts: new Date().toISOString() }))
      }

      const next = [...imported, ...notes]
      setNotes(next)
      persist(next)
    }
    reader.readAsText(file)
  }

  return (
    <div className="notes">
      <div className="notes-actions">
        <button className="study-submit" onClick={() => setShowDrop(true)}>Generate a Note</button>
        <label className="clear-btn import-label">
          <input
            type="file"
            accept=".txt,.json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files && e.target.files[0]
              if (f) importFromFile(f)
              e.target.value = ''
            }}
          />
          Import notes
        </label>
        <button className="clear-btn" onClick={clearNotes}>Clear all</button>
        {typeof onLogout === 'function' && (
          <button className="clear-btn" onClick={onLogout}>Log Out</button>
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
              <div className="note-body">
                {n.title && <div className="note-title">{n.title}</div>}
                {expanded ? (
                  <>
                    <div className="note-text">{n.text}</div>
                    <div className="note-ts">{new Date(n.ts).toLocaleString()}</div>
                  </>
                ) : (
                  <div style={{ color: '#666', fontStyle: 'italic' }}></div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="remove-btn" onClick={() => deleteNote(n.id)}>Delete</button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
