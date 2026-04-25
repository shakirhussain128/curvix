import { useState } from "react";

const files = [
  "index.js",
  "app.js",
  "utils.js",
  "server.js",
];

export default function FileExplorer({ onSelectFile }: any) {
  const [active, setActive] = useState("index.js");

  return (
    <div style={{ color: "#fff" }}>
      <h3>Files</h3>

      {files.map((file) => (
        <div
          key={file}
          onClick={() => {
            setActive(file);
            onSelectFile(file);
          }}
          style={{
            padding: "6px",
            cursor: "pointer",
            background: active === file ? "#333" : "transparent",
          }}
        >
          📄 {file}
        </div>
      ))}
    </div>
  );
}