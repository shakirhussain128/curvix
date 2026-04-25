import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function askAI(message: string, code: string) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are Curvix AI. You are a coding assistant. When user asks to modify code, return ONLY the updated full code without explanation.",
      },
      {
        role: "user",
        content: `User request: ${message}\n\nCurrent code:\n${code}`,
      },
    ],
  });

  return response.choices[0].message.content;
}