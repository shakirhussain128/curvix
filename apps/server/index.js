import express from "express";
import cors from "cors";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import aiRoute from "./routes/ai.js";

app.use("/api/ai", aiRoute);
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());


const SECRET = process.env.JWT_SECRET || "curvix_secret";

/* ================= USERS STORAGE ================= */
function getUsers() {
  if (!fs.existsSync("./users.json")) return [];
  return JSON.parse(fs.readFileSync("./users.json"));
}

function saveUsers(users) {
  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
}

/* ================= AUTH ================= */

app.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;

  const users = getUsers();

  const exists = users.find((u) => u.email === email);
  if (exists) return res.json({ error: "User exists" });

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

  const user = users.find((u) => u.email === email);
  if (!user) return res.json({ error: "User not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.json({ error: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

/* ================= AUTH MIDDLEWARE ================= */
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

/* ================= AI (MOCK / PLACEHOLDER) ================= */
app.post("/ai", auth, (req, res) => {
  const { prompt, file } = req.body;

  // simple mock AI (replace with OpenAI later)
  const result = {
    filePath: "app.tsx",
    content: file + "\n\n// AI Suggestion: " + prompt,
  };

  res.json({ result: JSON.stringify(result) });
});

/* ================= WORKSPACE ================= */
const WORKDIR = "./workspaces";

app.post("/workspace/create", auth, (req, res) => {
  const { name } = req.body;

  const path = `${WORKDIR}/${req.user.id}/${name}`;

  fs.mkdirSync(path, { recursive: true });

  res.json({ success: true });
});

app.get("/workspace/list", auth, (req, res) => {
  const path = `${WORKDIR}/${req.user.id}`;

  if (!fs.existsSync(path)) return res.json([]);

  res.json(fs.readdirSync(path));
});

/* ================= FILES ================= */
app.get("/workspace/files/:workspace", auth, (req, res) => {
  const { workspace } = req.params;
  const path = `${WORKDIR}/${req.user.id}/${workspace}`;

  if (!fs.existsSync(path)) return res.json({ error: "Workspace not found" });

  function getFiles(dir, relative = "") {
    const files = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = `${dir}/${item}`;
      const relPath = relative ? `${relative}/${item}` : item;
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files.push({ name: item, path: relPath, type: "directory", children: getFiles(fullPath, relPath) });
      } else {
        files.push({ name: item, path: relPath, type: "file" });
      }
    }
    return files;
  }

  res.json(getFiles(path));
});

app.get("/workspace/file/:workspace", auth, (req, res) => {
  const { workspace } = req.params;
  const filePath = req.path.replace(`/workspace/file/${workspace}`, "").substring(1);
  const path = `${WORKDIR}/${req.user.id}/${workspace}/${filePath}`;

  if (!fs.existsSync(path)) return res.json({ error: "File not found" });

  const content = fs.readFileSync(path, "utf8");
  res.json({ content });
});

app.put("/workspace/file/:workspace", auth, (req, res) => {
  const { workspace } = req.params;
  const filePath = req.path.replace(`/workspace/file/${workspace}`, "").substring(1);
  const { content } = req.body;
  const path = `${WORKDIR}/${req.user.id}/${workspace}/${filePath}`;

  fs.mkdirSync(path.substring(0, path.lastIndexOf("/")), { recursive: true });
  fs.writeFileSync(path, content);
  res.json({ success: true });
});

app.delete("/workspace/file/:workspace", auth, (req, res) => {
  const { workspace } = req.params;
  const filePath = req.path.replace(`/workspace/file/${workspace}`, "").substring(1);
  const path = `${WORKDIR}/${req.user.id}/${workspace}/${filePath}`;

  if (!fs.existsSync(path)) return res.json({ error: "File not found" });

  fs.unlinkSync(path);
  res.json({ success: true });
});

/* ================= START ================= */
app.listen(5000, () => {
  console.log("🚀 Curvix backend running on http://localhost:5000");
});
app.get("/", (req, res) => {
  res.send("🚀 Curvix Backend is Running Successfully");
});