import React, { useState, useEffect, useRef } from "react";

const App = () => {
  // State for managing user input
  const [message, setMessage] = useState("");

  // Stores suggestions received from the backend
  const [suggestions, setSuggestions] = useState([]);

  // Stores the history of messages (user and agent)
  const [history, setHistory] = useState([]);

  // Loading state for when the AI is "typing"
  const [loading, setLoading] = useState(false);

  // Ref to keep the input field focused
  const inputRef = useRef(null);

  // Auto-focus input field when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Function to send message to backend
  const handleSend = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

     // Add user message to history
    const userMessage = { role: "user", content: message };
    const updatedHistory = [...history, userMessage];
    setHistory(updatedHistory);
    
    // Initialize
    setMessage(""); // Clear input field
    setSuggestions([]); // Reset suggestions
    setLoading(true); // Show typing indicator

    try {
      // Send message to backend
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

  // Handles "Enter" key press to send the message
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // When user clicks a suggestion, insert it into input field
  const handleSuggestionClick = (text) => {
    setMessage(text);
    inputRef.current?.focus();
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto", fontFamily: "Arial" }}>
      <h2>AI Messaging Panel</h2>
      
      {/* Input Field and Send Button */}
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

      {/* Loading Indicator */}
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

      {/* Message History */}
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