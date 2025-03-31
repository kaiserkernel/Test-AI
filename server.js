const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Helper function to simulate a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.post("/suggestions", async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  // Error simulation (10% chance)
  if (Math.random() < 0.1) {
    return res.status(500).json({ error: "Server error. Please try again." });
  }

  // Simulating AI delay
  await delay(1000); // 1-second delay

  let suggestions = [];

  if (/hello|hi|hey/i.test(message)) {
    suggestions = [
      "Hello! How can I assist you today?",
      "Hey there! What do you need help with?",
      "Hi! Let me know how I can help.",
    ];
  } else if (/\?$/.test(message)) {
    suggestions = [
      `That's a great question! I'll find more info on "${message}"`,
      `Let me think... "${message}" is an interesting topic!`,
      `I need a moment to gather thoughts on "${message}".`,
    ];
  } else {
    suggestions = [
      `Got it, you're asking about: "${message}".`,
      `Let me look into "${message}" and get back to you.`,
      `Can you please clarify what you mean by "${message}"?`,
    ];
  }

  res.json({ suggestions });
});

app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
