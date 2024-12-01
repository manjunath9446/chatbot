import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));
const corsOptions = {
    origin: "https://chatbot-98v8.onrender.com", // Replace with your frontend URL
    methods: ["GET", "POST"], // Allowed HTTP methods
};
app.use(cors(corsOptions));

app.use(express.json());

app.post("/chat", (req, res) => {
    const userMessage = req.body.message;
    res.json({ response: `You said: ${userMessage}` });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "llama3-8b-8192",
        });
        const response = chatCompletion.choices[0]?.message?.content || "No response.";
        res.json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error processing your request." });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
