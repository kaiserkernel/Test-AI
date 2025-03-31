const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

// Middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Utility function to simulate delay in response
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Route to handle suggestions request
app.post("/suggestions", async (req, res) => {
  const { message } = req.body;

  // If message is empty, return error
  if (!message) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  // Simulate an occasional server error (10% chance)
  if (Math.random() < 0.1) {
    return res.status(500).json({ error: "Server error. Please try again." });
  }

  // Simulate a 1-second delay to mimic AI processing time
  await delay(1000);

  let suggestions = [];

  // If user says hello/hi/hey, respond with greetings
  if (/hello|hi|hey/i.test(message)) {
    suggestions = [
      "Hello! How can I assist you today?",
      "Hey there! What do you need help with?",
      "Hi! Let me know how I can help.",
    ];
  }
  // If message is a question (ends with '?'), generate a response
  else if (/\?$/.test(message)) {
    suggestions = [
      `That's a great question! I'll find more info on "${message}"`,
      `Let me think... "${message}" is an interesting topic!`,
      `I need a moment to gather thoughts on "${message}".`,
    ];
  }
  // If message is a general statement, give clarification-style responses
  else {
    suggestions = [
      `Got it, you're asking about: "${message}".`,
      `Let me look into "${message}" and get back to you.`,
      `Can you please clarify what you mean by "${message}"?`,
    ];
  }

  // Return suggestions as JSON response
  res.json({ suggestions });
});

// Start the server and listen on port 5000
app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
