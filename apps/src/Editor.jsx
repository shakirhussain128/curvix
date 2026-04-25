import AIChat from "../components/AIChat";
import Editor from "@monaco-editor/react";

export default function IDE() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Code Editor */}
      <div style={{ flex: 1 }}>
        <Editor
          height="100vh"
          defaultLanguage="javascript"
          defaultValue="// Start coding"
        />
      </div>

      {/* AI Assistant */}
      <AIChat />

    </div>
  );
}