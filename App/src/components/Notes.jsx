import React from 'react'

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

export default function Notes() {
  const [notes, setNotes] = React.useState(() => loadNotes())
  const [savedAt, setSavedAt] = React.useState(() => localStorage.getItem(STORAGE_KEY + ':ts'))

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
      text: `Sample note — created ${new Date().toLocaleString()}`,
      ts: new Date().toISOString(),
    }
    const next = [sample, ...notes]
    setNotes(next)
    persist(next)
  }

  const deleteNote = (id) => {
    const next = notes.filter((n) => n.id !== id)
    setNotes(next)
    persist(next)
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
          imported = parsed.map((t) => (typeof t === 'string' ? { id: Date.now() + Math.random(), text: t, ts: new Date().toISOString() } : { id: Date.now() + Math.random(), text: JSON.stringify(t), ts: new Date().toISOString() }))
        }
      } catch (e) {
        // treat as newline-separated text
        imported = text.split(/\r?\n/).filter(Boolean).map((t) => ({ id: Date.now() + Math.random(), text: t, ts: new Date().toISOString() }))
      }

      const next = [...imported, ...notes]
      setNotes(next)
      persist(next)
    }
    reader.readAsText(file)
  }

  return (
    <div className="notes">
      <div className="notes-header">
        <h3>Your saved notes</h3>
        <div className="notes-meta">{notes.length ? `${notes.length} notes` : 'No saved notes'}</div>
      </div>

      <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
        <button className="study-submit" onClick={addSampleNote}>Add sample note</button>
        <label className="clear-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
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
      </div>

      <ul className="notes-list">
        {notes.length === 0 && <li className="note-empty">No notes yet — add a sample note or import.</li>}
        {notes.map((n) => (
          <li key={n.id} className="note-item">
            <div className="note-body">
              <div className="note-text">{n.text}</div>
              <div className="note-ts">{new Date(n.ts).toLocaleString()}</div>
            </div>
            <button className="remove-btn" onClick={() => deleteNote(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
