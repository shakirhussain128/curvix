export async function runAI(prompt, file, context) {
  return await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are Curvix AI inside a SaaS IDE. Always return structured JSON edits.",
      },
      {
        role: "user",
        content: JSON.stringify({ prompt, file, context }),
      },
    ],
  });
}