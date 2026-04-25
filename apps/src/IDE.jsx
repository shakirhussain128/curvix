import AIChat from "../components/AIChat";
import Editor from "@monaco-editor/react";

export default function IDE() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* LEFT: Code Editor */}
      <div style={{ flex: 1 }}>
        <Editor
          height="100vh"
          defaultLanguage="javascript"
          defaultValue="// Start coding here"
        />
      </div>

      {/* RIGHT: AI ASSISTANT */}
      <AIChat />

    </div>
  );
}