import React, { useState, useEffect } from 'react';
import { Upload, FileText, BookOpen, Brain, LogOut, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const Dashboard = ({ signOut }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Decode email (sub) from JWT token
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUser({ email: payload.sub });
            } catch (e) {
                console.error('Invalid token:', e);
            }
        }
    }, []);

    // Fetch notes when user is set
    useEffect(() => {
        if (currentUser?.email) fetchUserNotes();
    }, [currentUser]);

    const fetchUserNotes = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/api/notes/user/${currentUser.email}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch notes');
            const data = await response.json();
            setNotes(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load notes');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setError(null);
            setUploadStatus(null);
        } else {
            setError('Please select a valid PDF file');
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !currentUser?.email) {
            setError('Please select a file and ensure user is authenticated');
            return;
        }

        setLoading(true);
        setError(null);
        setUploadStatus('uploading');

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('email', currentUser.email);

        try {
            const response = await fetch('http://localhost:8080/api/notes/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (!response.ok) throw new Error('Upload failed');

            const result = await response.json();
            setUploadStatus('success');
            await fetchUserNotes();
            setSelectedFile(null);
            document.getElementById('file-input').value = '';

            alert(`✅ Success! Generated ${result.flashcardCount} flashcards and ${result.topicCount} topics.`);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Upload failed');
            setUploadStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const viewFlashcards = (noteId) => (window.location.href = `/flashcards/${noteId}`);
    const takeQuiz = (noteId) => (window.location.href = `/quiz/${noteId}`);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <header className="bg-white shadow border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Brain className="w-8 h-8 text-indigo-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Study Dashboard</h1>
                            {currentUser && (
                                <p className="text-sm text-gray-600">Welcome, {currentUser.email}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Upload Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Upload className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Upload Study Notes</h2>
                    </div>

                    <div className="border-2 border-dashed border-indigo-300 rounded-xl p-8 mb-4 bg-indigo-50 hover:border-indigo-500 transition">
                        <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center">
                            <FileText className="w-12 h-12 text-indigo-400 mb-3" />
                            <span className="text-lg font-medium text-gray-700 mb-2">
                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
              </span>
                            <span className="text-sm text-gray-500">PDF files only (max 10MB)</span>
                            <input
                                id="file-input"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {uploadStatus === 'success' && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <p className="text-green-700">Notes processed successfully! AI generated your study materials.</p>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || loading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-300 transition flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                {uploadStatus === 'uploading' ? 'Processing with AI...' : 'Loading...'}
                            </>
                        ) : (
                            <>
                                <Upload className="w-6 h-6" />
                                Generate Study Materials
                            </>
                        )}
                    </button>
                </div>

                {/* Notes Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Your Notes</h2>
                    </div>

                    {loading && notes.length === 0 ? (
                        <div className="text-center py-12">
                            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600">Loading your notes...</p>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg mb-2">No notes uploaded yet</p>
                            <p className="text-gray-500">Upload a PDF to get started with AI-generated materials</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {notes.map((note) => (
                                <div
                                    key={note.noteId}
                                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <FileText className="w-8 h-8 text-indigo-600" />
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                note.processed
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                        >
                      {note.processed ? 'Processed' : 'Processing...'}
                    </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-800 mb-2 truncate" title={note.fileName}>
                                        {note.fileName}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Uploaded: {new Date(note.uploadDate).toLocaleDateString()}
                                    </p>

                                    {note.processed && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => viewFlashcards(note.noteId)}
                                                className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm font-medium"
                                            >
                                                Flashcards
                                            </button>
                                            <button
                                                onClick={() => takeQuiz(note.noteId)}
                                                className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm font-medium"
                                            >
                                                Quiz
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;


