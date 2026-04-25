import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  value: string;
  onChange: (newCode: string) => void;
};

export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      value={value}
      defaultValue="// Start coding here..."
      theme="vs-dark"
      options={{
        selectOnLineNumbers: true,
        cursorStyle: "line",
        cursorBlinking: "blink",
        cursorSmoothCaretAnimation: "on",
        fontSize: 15,
        minimap: { enabled: false },
        automaticLayout: true,
        wordWrap: "on",
        renderLineHighlight: "all",
        lineNumbers: "on",
        roundedSelection: true,
        scrollBeyondLastLine: false,
        folding: true,
        tabSize: 2,
      }}
      onChange={(newValue) => onChange(newValue || "")}
    />
  );
}