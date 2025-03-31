import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    const updatedHistory = [...history, userMessage];
    setHistory(updatedHistory);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error("Error:", err);
      setSuggestions(["(Error generating suggestions)"]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleSuggestionClick = (text) => {
    setMessage(text);
    inputRef.current?.focus();
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto", fontFamily: "Arial" }}>
      <h2>AI Messaging Panel</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <input
          type="text"
          value={message}
          ref={inputRef}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />
        <button onClick={handleSend} style={{ padding: "8px 12px", cursor: "pointer" }}>
          Send
        </button>
      </div>

      {loading && <p>Loading suggestions...</p>}

      <div style={{ marginTop: 20 }}>
        <strong>Suggestions:</strong>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(s)}
              style={{
                padding: "6px 12px",
                borderRadius: 5,
                border: "1px solid #007bff",
                background: "#f0f8ff",
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <strong>Message History:</strong>
        <div>
          {history.map((msg, idx) => (
            <div
              key={idx}
              style={{
                padding: "6px 10px",
                borderRadius: 5,
                margin: "5px 0",
                background: msg.role === "user" ? "#e0f7fa" : "#f1f1f1",
                textAlign: msg.role === "user" ? "right" : "left",
              }}
            >
              <b>{msg.role}:</b> {msg.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;