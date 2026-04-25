import { useState, useEffect } from "react";
import CodeEditor from "./components/CodeEditor";
import { API_URL } from "./config";
import "./App.css";

interface FileItem {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileItem[];
}

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<string>("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      loadWorkspaces();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (currentWorkspace) {
      loadFiles();
    }
  }, [currentWorkspace]);

  useEffect(() => {
    if (currentFile) {
      loadFile(currentFile);
    }
  }, [currentFile]);

  const loadWorkspaces = async () => {
    const res = await fetch(`${API_URL}/workspace/list`, {
      headers: { Authorization: token! },
    });
    const data = await res.json();
    setWorkspaces(data);
    if (data.length > 0) setCurrentWorkspace(data[0]);
  };

  const createWorkspace = async () => {
    await fetch(`${API_URL}/workspace/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
      body: JSON.stringify({ name: newWorkspace }),
    });
    loadWorkspaces();
    setNewWorkspace("");
  };

  const loadFiles = async () => {
    const res = await fetch(`${API_URL}/workspace/files/${currentWorkspace}`, {
      headers: { Authorization: token! },
    });
    const data = await res.json();
    setFiles(data);
  };

  const loadFile = async (filePath: string) => {
    const res = await fetch(`${API_URL}/workspace/file/${currentWorkspace}/${filePath}`, {
      headers: { Authorization: token! },
    });
    const data = await res.json();
    setCode(data.content || "");
  };

  const saveFile = async () => {
    if (!currentFile) return;
    await fetch(`${API_URL}/workspace/file/${currentWorkspace}/${currentFile}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
      body: JSON.stringify({ content: code }),
    });
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === "file") {
      setCurrentFile(file.path);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRun = () => {
    try {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(" "));
        originalLog(...args);
      };
      eval(code);
      console.log = originalLog;
      setOutput(logs.join("\n"));
    } catch (error) {
      if (error instanceof Error) {
        setOutput(`Error: ${error.message}`);
      }
    }
  };

  const handleAI = async () => {
    const res = await fetch(`${API_URL}/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
      body: JSON.stringify({ prompt: aiPrompt, file: code }),
    });
    const data = await res.json();
    if (data.result) {
      const result = JSON.parse(data.result);
      setCode(result.content);
    }
  };

  const handleAiAssist = async () => {
    const res = await fetch(`${API_URL}/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
      body: JSON.stringify({ prompt: aiPrompt, file: code }),
    });
    const data = await res.json();
    if (data.response) {
      setAiResponse(data.response);
    }
  };

  const handleSignup = async () => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Signup successful, now login");
      setIsSignup(false);
    } else {
      alert(data.error);
    }
  };

  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
    } else {
      alert(data.error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login">
        <h1>{isSignup ? "Signup" : "Login"} to Curvix IDE</h1>
        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={isSignup ? handleSignup : handleLogin}>
          {isSignup ? "Signup" : "Login"}
        </button>
        <button onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have account? Login" : "Need account? Signup"}
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="ide-header">
        <div className="ide-brand">
          <span className="ide-logo">CVX</span>
          <span className="ide-title">Curvix IDE</span>
        </div>
        <div className="ide-actions">
          <input
            type="text"
            placeholder="New workspace"
            value={newWorkspace}
            onChange={(e) => setNewWorkspace(e.target.value)}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #1f2937", background: "#0f172a", color: "#e2e8f0" }}
          />
          <button className="ide-button" onClick={createWorkspace}>Create WS</button>
          <button className="ide-button" onClick={saveFile}>Save</button>
          <button className="ide-button active" onClick={handleRun}>Run</button>
          <button className="ide-button">Preview</button>
        </div>
      </header>

      <div className="ide-tabs">
        <select value={currentWorkspace} onChange={(e) => setCurrentWorkspace(e.target.value)}>
          {workspaces.map(ws => <option key={ws} value={ws}>{ws}</option>)}
        </select>
        {files.filter(f => f.type === "file").map(file => (
          <div
            key={file.path}
            className={`ide-tab ${currentFile === file.path ? "active" : ""}`}
            onClick={() => handleFileClick(file)}
          >
            {file.name}
          </div>
        ))}
      </div>

      <div className="ide-body">
        <aside className="ide-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Explorer</div>
            {files.map(file => (
              <div
                key={file.path}
                className={`file-item ${currentFile === file.path ? "active" : ""}`}
                onClick={() => handleFileClick(file)}
              >
                {file.name}
              </div>
            ))}
          </div>
        </aside>

        <main className="ide-editor">
          <CodeEditor value={code} onChange={handleCodeChange} />
        </main>

        <aside className="ide-output">
          <div className="sidebar-title">Output</div>
          <pre>{output}</pre>
        </aside>

        <aside className="ide-ai">
          <div className="sidebar-title">AI Assistant</div>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ask AI to improve code..."
          />
          <button onClick={handleAI}>Ask AI</button>
          <button onClick={handleAiAssist}>AI Assist</button>
          <pre>{aiResponse}</pre>
        </aside>
      </div>

      <footer className="ide-status">
        <div className="status-item">JavaScript</div>
        <div className="status-item">UTF-8</div>
        <div className="status-item">Ln 1, Col 1</div>
        <div className="status-item">Ready</div>
      </footer>
    </div>
  );
}