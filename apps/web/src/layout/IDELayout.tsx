import { ReactNode } from "react";

export default function IDELayout({
  sidebar,
  editor,
  panel,
}: {
  sidebar: ReactNode;
  editor: ReactNode;
  panel: ReactNode;
}) {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#0d0d0d" }}>

      {/* LEFT SIDEBAR (Explorer) */}
      <div
        style={{
          width: 260,
          background: "#111",
          borderRight: "1px solid #222",
          color: "#fff",
          padding: 10,
        }}
      >
        {sidebar}
      </div>

      {/* MAIN EDITOR */}
      <div style={{ flex: 1 }}>{editor}</div>

      {/* RIGHT PANEL (AI) */}
      <div
        style={{
          width: 320,
          background: "#111",
          borderLeft: "1px solid #222",
          color: "#fff",
          padding: 10,
        }}
      >
        {panel}
      </div>

    </div>
  );
}