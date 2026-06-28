require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

// Check if API key is loading
console.log("API Key Loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
    res.send("SmartStudy AI Backend Running");
});
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        console.log("User message:", message);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash"
        });

        const result = await model.generateContent(message);

        const response = await result.response;
        const text = response.text();

        console.log("Gemini reply:", text);

        res.json({ reply: text });

    } catch (error) {
        console.log("BACKEND ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});