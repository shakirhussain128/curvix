import express from "express";
import cors from "cors";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
}));

const SECRET = process.env.JWT_SECRET || "curvix_secret";

/* ---------------- OPENAI ---------------- */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ---------------- USERS ---------------- */
const USERS_FILE = "./users.json";

function getUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

/* ---------------- AUTH ---------------- */
app.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;

  const users = getUsers();

  if (users.find(u => u.email === email)) {
    return res.json({ error: "User exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now().toString(),
    email,
    password: hashed,
  };

  users.push(user);
  saveUsers(users);

  res.json({ success: true });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const users = getUsers();

  const user = users.find(u => u.email === email);
  if (!user) return res.json({ error: "User not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.json({ error: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET
  );

  res.json({
    token,
    user: { id: user.id, email: user.email }
  });
});

/* ---------------- AUTH MIDDLEWARE ---------------- */
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.json({ error: "No token" });

  try {
    const data = jwt.verify(token, SECRET);
    req.user = data;
    next();
  } catch {
    res.json({ error: "Invalid token" });
  }
}

/* ---------------- FILE SYSTEM ---------------- */
const BASE = "./workspaces";

app.get("/files", auth, (req, res) => {
  const project = req.query.project || "main";

  const dir = `${BASE}/${req.user.id}/${project}`;

  if (!fs.existsSync(dir)) return res.json([]);

  const files = fs.readdirSync(dir).map(file => {
    const content = fs.readFileSync(`${dir}/${file}`, "utf-8");

    return { name: file, content };
  });

  res.json(files);
});

app.post("/files/save", auth, (req, res) => {
  const { project, fileName, content } = req.body;

  const dir = `${BASE}/${req.user.id}/${project}`;

  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(`${dir}/${fileName}`, content);

  res.json({ success: true });
});

/* ---------------- AI (REAL GPT) ---------------- */
app.post("/ai", auth, async (req, res) => {
  const { prompt, file } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a senior software engineer. Return only full updated code."
        },
        {
          role: "user",
          content: `
TASK: ${prompt}

CODE:
${file}
          `
        }
      ]
    });

    const result = response.choices[0].message.content;

    res.json({ result });
  } catch (err) {
    res.json({ error: "AI failed", details: err.message });
  }
});

/* ---------------- START ---------------- */
app.get("/", (req, res) => {
  res.send("🚀 Curvix Backend Running");
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});