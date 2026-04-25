import { useState } from "react";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      const aiMsg = { role: "ai", text: data.reply };

      setChat((prev) => [...prev, aiMsg]);
      setMessage("");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ width: "300px", borderLeft: "1px solid #333", padding: 10 }}>
      <h3>AI Assistant</h3>

      <div style={{ height: "400px", overflowY: "auto" }}>
        {chat.map((c, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>{c.role === "user" ? "You" : "AI"}:</b>
            <div>{c.text}</div>
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask AI about your code..."
        style={{ width: "100%" }}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}