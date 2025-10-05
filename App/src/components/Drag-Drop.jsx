import React, { useState, useRef, useEffect } from 'react'

// Drag-Drop.jsx
// A self-contained drag & drop + click upload component that accepts PDF, DOCX, PPT(X), and TXT.

export default function DragDrop({ onGenerated, onClose }) {
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('idle') // idle | uploading | done | error
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)
  const [showTitleInput, setShowTitleInput] = useState(false)
  const [title, setTitle] = useState('')
  const [flashcardStatus, setFlashcardStatus] = useState('idle') // idle | generating | done | error
  const inputRef = useRef(null)
  const titleInputRef = useRef(null)

  useEffect(() => {
    if (showTitleInput && titleInputRef.current) {
      try { titleInputRef.current.focus() } catch (e) {}
    }
  }, [showTitleInput])

  const accept = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.ms-powerpoint', 'text/plain']

  function onFilesSelected(selectedFiles) {
    const arr = Array.from(selectedFiles).map(f => ({ file: f, id: `${f.name}-${f.size}-${f.lastModified}` }))
    setFiles(arr)
    setSummary(null)
    setError(null)
    setFlashcardStatus('idle') // Reset flashcard status
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    const dropped = e.dataTransfer.files
    onFilesSelected(dropped)
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
    // indicate copy
    e.dataTransfer.dropEffect = 'copy'
  }

  function openFileDialog() {
    if (inputRef.current) inputRef.current.click()
  }

  async function generateOverview() {
    setStatus('uploading')
    setSummary(null)
    setError(null)
    setFlashcardStatus('idle')

    if (files.length === 0) {
      setError('Please select at least one file to summarize.')
      setStatus('error')
      return
    }

    // Prepare FormData for a server endpoint
    const fd = new FormData()
    files.forEach((f, i) => fd.append('files', f.file, f.file.name))

    const apiUrl = 'http://localhost:8080/api/summarize'; 

    try {
      // Try to call a server-side summarization endpoint.
      const res = await fetch(apiUrl, { method: 'POST', body: fd }) // Use the new apiUrl
      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      const data = await res.json()
      if (data && data.summary) {
        setSummary(data.summary)
        setStatus('done')
        return
      }
      // fallback to mock
      throw new Error('No summary in response')
    } catch (err) {
      // Server not available or failed. Fall back to client-side mock summary.
      console.warn('Summarization endpoint call failed, falling back to mock. Error:', err)
      try {
        const mock = await mockSummary(files)
        setSummary(mock)
        setStatus('done')
      } catch (merr) {
        setError(String(merr))
        setStatus('error')
      }
    }
  }

  // New function to generate flashcards from the summary text
  async function generateFlashcards() {
    if (!summary) return
    setFlashcardStatus('generating')
    
    // The API URL for flashcard generation
    const flashcardApiUrl = 'http://localhost:8080/api/flashcards'; 
    
    try {
      // Send the generated summary text to the flashcard API
      const res = await fetch(flashcardApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ summaryText: summary }), // Send summary text in the body
      })

      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      
      const data = await res.json()
      
      if (data && data.flashcards) {
        // Assume the backend returns a flashcards array/object
        // For now, we'll just log success and update the button status
        console.log('Flashcards generated successfully:', data.flashcards);
        setFlashcardStatus('done'); 
        // NOTE: To fully implement this, you'll need logic here to save or display the flashcards (e.g., adding them to notes).
      } else {
        throw new Error('Flashcard generation failed: No flashcards returned.')
      }

    } catch (err) {
      console.error('Flashcard generation failed:', err);
      setFlashcardStatus('error');
      // Optionally update the main error message or give specific flashcard error feedback
    }
  }

  async function mockSummary(filesArr) {
    const parts = ['(MOCK SUMMARY) File Previews:']
    for (const entry of filesArr) {
      const f = entry.file
      const lower = f.name.toLowerCase()
      if (lower.endsWith('.txt')) {
        const txt = await f.text()
        parts.push(`- ${f.name}\n  Content: ${txt.slice(0, 200).replace(/\s+/g, ' ')}${txt.length > 200 ? '…' : ''}`)
      } else {
        parts.push(`- ${f.name} (Binary file) — size: ${Math.round(f.size/1024)}KB`) 
      }
    }
    parts.push('\nNote: This is a client-side preview. A real summary requires a server-side AI endpoint.')
    return parts.join('\n')
  }

  return (
    <div>
      <style>{`
        .dd-zone { border: 2px dashed #cbd5e1; padding: 32px; border-radius: 10px; cursor: pointer; background: #fbfdff }
        .dd-zone.hover { border-color: #4f46e5; background: #f7f7ff }
        .file-list { margin-top: 12px; text-align: left }
        .file-item { display:flex; justify-content:space-between; padding:6px 8px; border-bottom:1px dashed #eee }
        .controls { margin-top:12px; display:flex; gap:8px }
        .summary { margin-top:12px; white-space:pre-wrap; text-align:left; background:#fff; padding:12px; border-radius:8px; border:1px solid #eef }
      `}</style>

      {/* ... (rest of the file upload UI) ... */}

      <div
        className="dd-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={openFileDialog}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') openFileDialog() }}
      >
        <input
          ref={inputRef}
          type="file"
          style={{ display: 'none' }}
          multiple
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
          onChange={(e) => onFilesSelected(e.target.files)}
        />
        <strong>Click or drop files here</strong>
        <div style={{ marginTop: 8, color: '#666' }}>Supported: PDF, DOCX, PPT(X), TXT</div>
      </div>

      <div className="file-list">
        {files.length === 0 ? (
          <div style={{ color: '#666', marginTop: 8 }}>No files selected</div>
        ) : (
          files.map(f => (
            <div key={f.id} className="file-item">
              <div style={{ fontSize: 14 }}>{f.file.name}</div>
              <div style={{ color: '#666', fontSize: 13 }}>{Math.round(f.file.size/1024)} KB</div>
            </div>
          ))
        )}
      </div>

      <div className="controls">
        <button onClick={generateOverview} disabled={status === 'uploading' || files.length === 0}>{status === 'uploading' ? 'Generating...' : 'Generate an overview'}</button>
        <button onClick={() => { setFiles([]); setSummary(null); setStatus('idle'); setError(null) }}>Clear</button>
      </div>

      {status === 'error' && error && <div style={{ color: '#b91c1c', marginTop: 8 }}>{error}</div>}

      {summary && (
        <div className="summary">
          <strong>Overview</strong>
          <div style={{ marginTop: 8 }}>{summary}</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexDirection: 'column', alignItems: 'flex-start' }}>
            {!showTitleInput ? (
              <div style={{ display: 'flex', gap: 8 }}>
                
                {/* *** FLASHCARD BUTTON ADDED HERE *** */}
                <button 
                  onClick={generateFlashcards} 
                  disabled={flashcardStatus === 'generating'}
                  style={{ background: flashcardStatus === 'done' ? '#d1fae5' : flashcardStatus === 'error' ? '#fee2e2' : '', 
                           color: flashcardStatus === 'done' ? '#065f46' : flashcardStatus === 'error' ? '#991b1b' : '' }}>
                  {flashcardStatus === 'generating' ? 'Generating Flashcards...' : flashcardStatus === 'done' ? 'Flashcards Generated! ✅' : 'Generate Flashcards'}
                </button>
                {/* *** END FLASHCARD BUTTON *** */}

                <button onClick={() => {
                  const defaultTitle = (summary || '').split('\n')[0].slice(0, 60) || 'New note'
                  setTitle(defaultTitle)
                  setShowTitleInput(true)
                }}>Save as note</button>

                <button onClick={() => { setFiles([]); setSummary(null); setStatus('idle'); setError(null); setShowTitleInput(false); setTitle('') }}>New file</button>
                {typeof onClose === 'function' && <button onClick={() => onClose()}>Close</button>}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  ref={titleInputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for this note"
                  style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (typeof onGenerated === 'function') onGenerated(summary, title)
                      setShowTitleInput(false)
                      setTitle('')
                    }
                  }}
                />
                <button onClick={() => {
                  if (typeof onGenerated === 'function') onGenerated(summary, title)
                  setShowTitleInput(false)
                  setTitle('')
                }}>Confirm Save</button>
                <button onClick={() => { setShowTitleInput(false); setTitle('') }}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}