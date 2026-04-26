import express from "express";
import OpenAI from "openai";
import jwt from "jsonwebtoken";

const router = express.Router();

const SECRET = process.env.JWT_SECRET || "curvix_secret";

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

router.use(auth);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { prompt, file } = req.body;

    const message = `Code: ${file}\n\nPrompt: ${prompt}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert coding assistant inside an IDE. Help with debugging, code generation, and explanations. Provide improved code based on the prompt.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;