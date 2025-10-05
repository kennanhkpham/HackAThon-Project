import React, { useState, useRef, useEffect } from 'react'

export default function DragDrop({ onGenerated, onClose }) {
    const [file, setFile] = useState(null)
    const [status, setStatus] = useState('idle') // idle | uploading | done | error
    const [summary, setSummary] = useState(null)
    const [error, setError] = useState(null)
    const inputRef = useRef(null)

    function handleFileSelected(selectedFile) {
        setFile(selectedFile)
        setSummary(null)
        setError(null)
    }

    function handleDrop(e) {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.files.length > 0) {
            handleFileSelected(e.dataTransfer.files[0])
        }
    }

    function handleDragOver(e) {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'copy'
    }

    function openFileDialog() {
        if (inputRef.current) inputRef.current.click()
    }

    async function generateOverview() {
        setStatus('uploading')
        setSummary(null)
        setError(null)

        if (!file) {
            setError('Please select a file to summarize.')
            setStatus('error')
            return
        }

        const fd = new FormData()
        fd.append('file', file, file.name) // Match Spring Boot backend

        const apiUrl = 'http://localhost:8080/api/v1/note/upload' // backend port

        try {
            const res = await fetch(apiUrl, { method: 'POST', body: fd })
            if (!res.ok) throw new Error(`Server responded ${res.status}`)

            const data = await res.json()
            if (data && data.summary) {
                setSummary(data.summary)
                setStatus('done')
            } else {
                throw new Error('No summary in response')
            }
        } catch (err) {
            console.warn('Summarization endpoint failed, falling back to mock. Error:', err)
            setSummary(`(MOCK SUMMARY) File: ${file.name}\nNo server response.`)
            setStatus('done')
        }
    }

    return (
        <div>
            <style>{`
        .dd-zone { border: 2px dashed #cbd5e1; padding: 32px; border-radius: 10px; cursor: pointer; background: #fbfdff }
        .file-info { margin-top: 12px; text-align: left }
        .summary { margin-top: 12px; white-space: pre-wrap; text-align:left; background:#fff; padding:12px; border-radius:8px; border:1px solid #eef }
      `}</style>

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
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={(e) => e.target.files[0] && handleFileSelected(e.target.files[0])}
                />
                <strong>Click or drop a file here</strong>
                <div style={{ marginTop: 8, color: '#666' }}>Supported: PDF, DOCX, PPT(X), TXT</div>
            </div>

            <div className="file-info">
                {file ? (
                    <div>{file.name} — {Math.round(file.size / 1024)} KB</div>
                ) : (
                    <div style={{ color: '#666', marginTop: 8 }}>No file selected</div>
                )}
            </div>

            <div style={{ marginTop: 12 }}>
                <button onClick={generateOverview} disabled={status === 'uploading' || !file}>
                    {status === 'uploading' ? 'Generating...' : 'Generate Overview'}
                </button>
                <button onClick={() => { setFile(null); setSummary(null); setStatus('idle'); setError(null) }}>
                    Clear
                </button>
            </div>

            {status === 'error' && error && <div style={{ color: '#b91c1c', marginTop: 8 }}>{error}</div>}

            {summary && (
                <div className="summary">
                    <strong>Overview</strong>
                    <div style={{ marginTop: 8 }}>{summary}</div>
                </div>
            )}
        </div>
    )
}
