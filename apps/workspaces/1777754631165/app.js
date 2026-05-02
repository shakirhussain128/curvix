const Groq = require('groq-sdk');

// AI Endpoint
app.post('/api/ai', async (req, res) => {
    try {
        const { prompt, fileName, fileContent } = req.body;

        // Yahan apni Groq API Key daalein ya environment variable use karein
        const groq = new Groq({ apiKey: 'YOUR_GROQ_API_KEY_HERE' });

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a pro coder. Only return the updated code, no explanation." },
                { role: "user", content: `File: ${fileName}\nCurrent Code:\n${fileContent}\n\nTask: ${prompt}` }
            ],
            model: "llama3-8b-8192",
        });

        const aiCode = completion.choices[0]?.message?.content || "";
        res.json({ code: aiCode });

    } catch (error) {
        console.error("AI Server Error:", error);
        res.status(500).json({ error: "AI processing failed", details: error.message });
    }
});