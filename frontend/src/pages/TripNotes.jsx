import Layout from "../components/Layout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaCalendarAlt,
  FaBookOpen,
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";



import API from "../services/api";

function TripNotes() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchTrip = async () => {
      try {
        const response = await API.get("/trips");
        const selectedTrip = response.data.find((item) => item.id === Number(id));
        if (!selectedTrip) {
          setError("Trip not found.");
          return;
        }
        setTrip(selectedTrip);
      } catch (err) {
        console.error(err);
        setError("Unable to load trip details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();

    // Load notes from localStorage
    const storedNotes = localStorage.getItem(`trip-notes-${id}`);
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(`trip-notes-${id}`, JSON.stringify(notes));
    }
  }, [id, notes, loading]);

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      setError("Please fill in both title and content.");
      return;
    }

    setError("");
    setSaving(true);

    const note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      timestamp: new Date().toISOString(),
    };

    setNotes((prev) => [note, ...prev]);
    setNewNote({ title: "", content: "" });
    setSaving(false);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
  };

  const handleSaveEdit = () => {
    if (!editingNote.title.trim() || !editingNote.content.trim()) {
      setError("Please fill in both title and content.");
      return;
    }

    setError("");
    setNotes((prev) =>
      prev.map((note) =>
        note.id === editingNote.id ? { ...editingNote } : note
      )
    );
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId) => {
    const confirmed = window.confirm("Delete this note?");
    if (!confirmed) return;
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading trip notes...
      </div>
    );
  }

  return (
    <Layout>
        <div className="p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 border border-white/10 rounded-[32px] p-8 shadow-2xl mb-10"
          >
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              <div>
                <p className="uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">
                  Trip Notes
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Journal for {trip?.title}
                </h1>
                <p className="mt-4 max-w-2xl text-slate-300 text-lg leading-relaxed">
                  Capture memories, tips, and insights from your trip. Organize and search your personal travel journal.
                </p>
              </div>
              <button
                onClick={() => navigate(`/trip/${id}`)}
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-3 rounded-2xl font-semibold transition"
              >
                <FaArrowLeft />
                Back to Itinerary
              </button>
            </div>
          </motion.div>

          <div className="grid gap-8 xl:grid-cols-[1fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Search */}
              <div className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-4 text-cyan-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="w-full bg-slate-950/80 border border-white/10 rounded-3xl py-4 pl-14 pr-6 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Add Note */}
              <div className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Add New Note</h2>
                <div className="space-y-4">
                  <input
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Note title"
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Note content"
                    rows={4}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 rounded-2xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FaPlus />
                    {saving ? "Adding..." : "Add Note"}
                  </button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-6">
                {filteredNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    whileHover={{ y: -4 }}
                    className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 shadow-xl"
                  >
                    {editingNote?.id === note.id ? (
                      <div className="space-y-4">
                        <input
                          value={editingNote.title}
                          onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                          className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                        />
                        <textarea
                          value={editingNote.content}
                          onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                          rows={4}
                          className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                        />
                        <div className="flex gap-4">
                          <button
                            onClick={handleSaveEdit}
                            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-2xl font-semibold transition"
                          >
                            <FaSave />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNote(null)}
                            className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-2xl font-semibold transition"
                          >
                            <FaTimes />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white">{note.title}</h3>
                            <p className="text-slate-400 text-sm mt-1">
                              {new Date(note.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditNote(note)}
                              className="rounded-3xl border border-white/10 bg-slate-950/80 p-3 text-slate-300 hover:text-white transition"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="rounded-3xl border border-red-500/30 bg-red-500/10 p-3 text-red-300 hover:bg-red-500/20 transition"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{note.content}</p>
                      </>
                    )}
                  </motion.div>
                ))}
                {filteredNotes.length === 0 && (
                  <div className="bg-slate-900/80 border border-white/10 rounded-[28px] p-10 text-center text-slate-400">
                    {searchQuery ? "No notes match your search." : "No notes yet. Add your first trip memory!"}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-cyan-500/10 to-slate-900/60 border border-cyan-400/10 rounded-[28px] p-6 shadow-xl"
            >
              <p className="uppercase tracking-[0.2em] text-cyan-300 font-semibold mb-4">
                Journal Stats
              </p>
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Total Notes</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{notes.length}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Last Updated</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {notes.length > 0 ? new Date(notes[0].timestamp).toLocaleDateString() : "Never"}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Trip Duration</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {trip ? `${trip.start_date} - ${trip.end_date}` : "N/A"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-100"
            >
              <div className="flex items-center gap-3">
                <FaExclamationTriangle />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </div>
      </Layout>
  );
}

export default TripNotes;
