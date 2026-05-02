const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

// 🔑 APNI ASLI API KEY YAHAN DALEIN
// Agar key nahi hai to https://console.groq.com/keys se banayein
const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE"; 

let groq;
try {
    groq = new Groq({ apiKey: GROQ_API_KEY });
} catch (e) {
    console.error("❌ Groq Initialization Error:", e.message);
}

// AI Endpoint
app.post('/api/ai', async (req, res) => {
    try {
        const { prompt, fileName, fileContent } = req.body;
        console.log(`\n🤖 AI Request receive hui for: ${fileName}`);

        if (!GROQ_API_KEY || GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE") {
            console.log("⚠️ API Key missing hai! Dummy response bhej raha hoon.");
            return res.json({ code: "// Please add your Groq API Key in server.cjs\nconsole.log('AI Demo Mode Active');" });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a coding assistant. Return only code without markdown or explanation." },
                { role: "user", content: `File: ${fileName}\nCode:\n${fileContent}\nTask: ${prompt}` }
            ],
            model: "llama3-8b-8192",
        });

        const aiCode = completion.choices[0]?.message?.content || "";
        console.log("✅ AI ne code generate kar liya!");
        res.json({ code: aiCode });

    } catch (error) {
        // Yeh error aapke VS Code ke Terminal mein dikhega
        console.error("❌ SERVER CRASH ERROR:", error.message);
        res.status(500).json({ error: "Server Internal Error", details: error.message });
    }
});

// Run Code Endpoint
app.post('/api/run', (req, res) => {
    const { fileName, content } = req.body;
    const ext = fileName.split('.').pop();
    const filePath = path.join(TEMP_DIR, `run_${Date.now()}.${ext}`);
    fs.writeFileSync(filePath, content);

    let cmd = ext === 'py' ? 'python3' : ext === 'js' ? 'node' : null;
    if (!cmd) return res.json({ output: "Is extension ko run nahi kar sakta." });

    const proc = spawn(cmd, [filePath]);
    let out = "";
    proc.stdout.on('data', d => out += d.toString());
    proc.stderr.on('data', d => out += d.toString());
    proc.on('close', () => {
        fs.unlinkSync(filePath);
        res.json({ output: out || "Executed (No output)." });
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Curvix Server is LIVE at http://localhost:${PORT}`);
    console.log(`👉 AI Key Status: ${GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE" ? "MISSING ❌" : "SET ✅"}`);
});