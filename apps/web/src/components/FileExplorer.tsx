const files = [
  "index.js",
  "app.js",
  "server.js",
  "utils.js",
];

export default function FileExplorer({
  onSelect,
}: {
  onSelect: (file: string) => void;
}) {
  return (
    <div>
      <h3 style={{ marginBottom: 10 }}>📁 Explorer</h3>

      {files.map((file) => (
        <div
          key={file}
          onClick={() => onSelect(file)}
          style={{
            padding: "6px",
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          📄 {file}
        </div>
      ))}
    </div>
  );
}