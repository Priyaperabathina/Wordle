import React, { useEffect, useState } from "react";

const AdminWordsPage = () => {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch words from backend
  const fetchWords = async () => {
    try {
      const res = await fetch("/api/admin/words");
      if (!res.ok) throw new Error("Failed to fetch words");
      const data = await res.json();
      setWords(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  // Add new word
  const handleAddWord = async (e) => {
    e.preventDefault(); // prevent full page reload
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/words?word=${newWord}`, {
        method: "POST",
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to add word");
        return;
      }
      setNewWord("");
      fetchWords();
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Toggle active/inactive
  const handleToggle = async (id, isActive) => {
    try {
      await fetch(`/api/admin/words/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      fetchWords();
    } catch (err) {
      alert("Failed to toggle word status");
    }
  };

  // Delete word
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this word?")) return;
    try {
      await fetch(`/api/admin/words/${id}`, { method: "DELETE" });
      fetchWords();
    } catch (err) {
      alert("Failed to delete word");
    }
  };

  return (
    <div className="p-4">
      <h2>Manage Words</h2>

      <form className="mb-3 d-flex gap-2" onSubmit={handleAddWord}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter 5-letter word"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value.toUpperCase())}
          maxLength={5}
          required
          disabled={loading}
        />
        <button className="btn btn-success" disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Word</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {words.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No words found
              </td>
            </tr>
          ) : (
            words.map((w) => (
              <tr key={w.id}>
                <td>{w.id}</td>
                <td>{w.word}</td>
                <td>
                  <span
                    className={`badge ${
                      w.isActive ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {w.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleToggle(w.id, w.isActive)}
                  >
                    {w.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(w.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminWordsPage;
