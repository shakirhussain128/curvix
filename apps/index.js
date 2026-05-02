import fs from "fs";
import path from "path";
import Groq from "groq-sdk";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const SECRET = process.env.JWT_SECRET || "curvix_mega_secret";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const USERS_FILE = "./users.json";
const BASE_DIR = "./workspaces";

// Ensure workspaces directory exists
if (!fs.existsSync(BASE_DIR)) fs.mkdirSync(BASE_DIR);

// Helper Functions
const getUsers = () => {
    try {
        return fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE)) : [];
    } catch (e) { return []; }
};
const saveUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

/* ---------------- SERVER STATUS ---------------- */
app.get("/", (req, res) => {
    res.send("🚀 Curvix Pro Backend is Running Successfully on Port 5000!");
});

/* ---------------- AUTH ROUTES ---------------- */
app.post("/auth/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.json({ error: "Missing fields" });

        const users = getUsers();
        if (users.find(u => u.email === email)) return res.json({ error: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = { id: Date.now().toString(), email, password: hashed };
        users.push(user);
        saveUsers(users);
        
        console.log(`✅ New user signed up: ${email}`);
        res.json({ success: true });
    } catch (err) {
        res.json({ error: "Signup failed" });
    }
});

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = getUsers().find(u => u.email === email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.json({ error: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '24h' });
    console.log(`🔑 User logged in: ${email}`);
    res.json({ token, user: { id: user.id, email: user.email } });
});

/* ---------------- AUTH MIDDLEWARE ---------------- */
const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Access denied" });

    // Handle 'Bearer <token>' format if sent
    if (token.startsWith('Bearer ')) token = token.slice(7, token.length);

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch (err) { 
        res.status(400).json({ error: "Invalid token" }); 
    }
};

/* ---------------- FILE SYSTEM ---------------- */
app.get("/files", verifyToken, (req, res) => {
    const userDir = path.join(BASE_DIR, req.user.id);
    if (!fs.existsSync(userDir)) return res.json([]);
    
    const files = fs.readdirSync(userDir).map(file => ({
        name: file,
        content: fs.readFileSync(path.join(userDir, file), "utf-8")
    }));
    res.json(files);
});

app.post("/files/save", verifyToken, (req, res) => {
    const { fileName, content } = req.body;
    const userDir = path.join(BASE_DIR, req.user.id);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    
    fs.writeFileSync(path.join(userDir, fileName), content);
    res.json({ success: true });
});

/* ---------------- GROQ AI ---------------- */
app.post("/api/ai", verifyToken, async (req, res) => {
    const { prompt, fileName, fileContent } = req.body;
    try {
        const chat = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a senior developer. Return ONLY raw code without explanations or backticks." },
                { role: "user", content: `File: ${fileName}\nTask: ${prompt}\nCode:\n${fileContent}` }
            ],
            model: "llama3-8b-8192",
        });
        res.json({ code: chat.choices[0].message.content });
    } catch (err) { 
        console.error("AI Error:", err.message);
        res.status(500).json({ error: "AI generation failed" }); 
    }
});

/* ---------------- START ---------------- */
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`------------------------------------------`);
    console.log(`🚀 Curvix Pro Backend: http://localhost:${PORT}`);
    console.log(`📂 Users File: ${path.resolve(USERS_FILE)}`);
    console.log(`------------------------------------------`);
});