<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Curvix Pro Ultra - Final</title>
    <link rel="stylesheet" data-name="vs/editor/editor.main" href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs/editor/editor.main.min.css">
    <style>
        :root { --bg: #1e1e1e; --side: #252526; --accent: #007acc; --header: #333; --text: #d4d4d4; --success: #28a745; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); overflow: hidden; }

        /* Navbar Enhancements */
        .navbar { height: 50px; background: var(--header); display: flex; align-items: center; padding: 0 15px; justify-content: space-between; border-bottom: 2px solid #000; }
        .nav-tools { display: flex; gap: 10px; align-items: center; }
        .btn-run { background: var(--success); color: white; border: none; padding: 6px 18px; border-radius: 4px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .btn-run:hover { background: #218838; transform: scale(1.05); }
        .btn-util { background: #444; border: none; color: white; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; }

        .main-content { display: flex; flex: 1; height: calc(100vh - 50px); overflow: hidden; }
        
        /* Sidebar with Search */
        .sidebar { width: 250px; background: var(--side); border-right: 2px solid #000; display: flex; flex-direction: column; }
        .search-container { padding: 10px; background: rgba(0,0,0,0.2); }
        .search-bar { width: 100%; background: #3c3c3c; border: 1px solid #555; color: white; padding: 6px; border-radius: 4px; outline: none; font-size: 12px; }
        
        .sidebar-header { padding: 10px 15px; font-size: 11px; font-weight: bold; opacity: 0.6; display: flex; justify-content: space-between; align-items: center; }
        .file-list { flex: 1; overflow-y: auto; }
        .file-item { padding: 8px 15px; font-size: 13px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .file-item.active { background: #37373d; border-left: 3px solid var(--accent); color: white; }

        /* Editor & Output */
        .editor-container { flex: 1; display: flex; flex-direction: column; }
        .output-panel { height: 150px; background: #121212; border-top: 2px solid #333; padding: 10px; font-family: monospace; font-size: 12px; overflow-y: auto; color: #aaa; }
        .output-panel b { color: var(--accent); }

        .preview-box { width: 400px; background: white; border-left: 2px solid #000; display: flex; flex-direction: column; }
        iframe { flex: 1; border: none; }

        /* AI Floating */
        #ai-fab { position: fixed; bottom: 20px; right: 20px; width: 55px; height: 55px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; font-size: 24px; box-shadow: 0 8px 20px rgba(0,0,0,0.5); }
        #ai-window { position: fixed; bottom: 85px; right: 20px; width: 350px; height: 480px; background: #252526; border-radius: 12px; border: 1px solid #444; display: flex; flex-direction: column; z-index: 1000; transition: 0.3s; transform: scale(0); transform-origin: bottom right; overflow: hidden; }
        .show-ai { transform: scale(1) !important; }
        
        .hidden { display: none !important; }
    </style>
</head>
<body>

<div id="auth-overlay">
    <div class="auth-card" style="text-align: center; margin-top: 20vh;">
        <h1 style="color:var(--accent)">CURVIX PRO</h1>
        <div style="margin-top:20px;">
            <input type="email" id="email" placeholder="Email" style="padding:10px; margin:5px; width:250px;"><br>
            <input type="password" id="password" placeholder="Password" style="padding:10px; margin:5px; width:250px;"><br>
            <button onclick="auth('login')" class="btn-run" style="margin-top:10px;">LOGIN</button>
            <p onclick="auth('signup')" style="cursor:pointer; font-size:12px; margin-top:10px; opacity:0.5;">New Account?</p>
        </div>
    </div>
</div>

<div class="app-container hidden" id="main-app">
    <!-- Navbar -->
    <div class="navbar">
        <div style="font-weight:bold; color:var(--accent); font-size:20px;">CURVIX <span style="color:white">PRO</span></div>
        <div class="nav-tools">
            <button class="btn-run" onclick="runCode()">RUN CODE ▶</button>
            <button class="btn-util" onclick="downloadCode()">Download 💾</button>
            <button class="btn-util" onclick="logout()" style="color:#ef5350;">Logout</button>
        </div>
    </div>

    <div class="main-content">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="search-container">
                <input type="text" id="file-search" class="search-bar" placeholder="Search files..." oninput="renderSidebar()">
            </div>
            <div class="sidebar-header">
                <span>PROJECT EXPLORER</span>
                <span onclick="createNewFile()" style="cursor:pointer; color:var(--accent); font-size:18px;">+</span>
            </div>
            <div class="file-list" id="file-list"></div>
        </div>

        <!-- Editor & Terminal -->
        <div class="editor-container">
            <div id="monaco-editor" style="flex:1;"></div>
            <div class="output-panel" id="terminal">
                <b>[Curvix Terminal]</b> System ready. Click RUN to execute web code.
            </div>
        </div>

        <!-- Web Preview -->
        <div class="preview-box" id="preview-section">
            <div style="background:#ddd; color:#333; padding:5px 15px; font-size:11px; font-weight:bold;">LIVE PREVIEW</div>
            <iframe id="preview-frame"></iframe>
        </div>
    </div>

    <!-- AI Agent -->
    <div id="ai-fab" onclick="document.getElementById('ai-window').classList.toggle('show-ai')">✨</div>
    <div id="ai-window">
        <div style="padding:15px; background:var(--header); font-weight:bold; display:flex; justify-content:space-between;">
            <span>Curvix AI Agent</span>
            <span onclick="document.getElementById('ai-window').classList.remove('show-ai')" style="cursor:pointer;">✖</span>
        </div>
        <div id="chat-history" style="flex:1; padding:15px; overflow-y:auto; font-size:13px; background:#1e1e1e;"></div>
        <div style="padding:15px; background:#252526; border-top:1px solid #444;">
            <textarea id="ai-prompt" placeholder="Ask AI to code..." style="width:100%; background:#1e1e1e; color:white; border:none; padding:8px; border-radius:5px; resize:none;"></textarea>
            <button onclick="askAI()" id="ai-btn" style="width:100%; background:var(--accent); color:white; border:none; padding:10px; margin-top:10px; border-radius:5px; font-weight:bold; cursor:pointer;">Generate Code</button>
        </div>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs/loader.min.js"></script>
<script>
    const API_URL = "https://urban-funicular-97j9x4vrvvw6hg5w-5000.app.github.dev";
    let editor, activeFile = 'index.html';
    let files = JSON.parse(localStorage.getItem('curvix_files')) || {
        'index.html': { content: '<h1>Welcome to Curvix Pro</h1>', lang: 'html' },
        'style.css': { content: 'body { background: #f0f0f0; text-align: center; font-family: sans-serif; }', lang: 'css' }
    };

    // 1. Auth & Init
    async function auth(type) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const res = await fetch(`${API_URL}/auth/${type}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if(data.token) { localStorage.setItem('token', data.token); initApp(); }
        else if(data.success) alert("Account Created! Please Login.");
        else alert(data.error);
    }

    function initApp() {
        document.getElementById('auth-overlay').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        loadEditor();
    }

    // 2. Editor & Files
    function loadEditor() {
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            editor = monaco.editor.create(document.getElementById('monaco-editor'), {
                value: files[activeFile].content,
                language: files[activeFile].lang,
                theme: 'vs-dark',
                automaticLayout: true
            });

            editor.onDidChangeModelContent(() => {
                files[activeFile].content = editor.getValue();
                localStorage.setItem('curvix_files', JSON.stringify(files));
                autoSave();
            });
            renderSidebar();
        });
    }

    function renderSidebar() {
        const query = document.getElementById('file-search').value.toLowerCase();
        const list = document.getElementById('file-list');
        list.innerHTML = '';
        Object.keys(files).forEach(f => {
            if(f.toLowerCase().includes(query)) {
                const div = document.createElement('div');
                div.className = `file-item ${f === activeFile ? 'active' : ''}`;
                div.innerHTML = `<span>📄 ${f}</span><span onclick="deleteFile('${f}', event)" style="opacity:0.5; font-size:10px;">✖</span>`;
                div.onclick = () => switchFile(f);
                list.appendChild(div);
            }
        });
    }

    function switchFile(f) {
        activeFile = f;
        editor.setValue(files[f].content);
        monaco.editor.setModelLanguage(editor.getModel(), files[f].lang);
        const isWeb = f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js');
        document.getElementById('preview-section').style.display = isWeb ? 'flex' : 'none';
        renderSidebar();
    }

    function createNewFile() {
        const name = prompt("File name (e.g. app.py):");
        if(!name || files[name]) return;
        const ext = name.split('.').pop();
        const langMap = { 'js':'javascript', 'py':'python', 'html':'html', 'css':'css' };
        files[name] = { content: '', lang: langMap[ext] || 'plaintext' };
        switchFile(name);
    }

    // 3. Execution & Utils
    function runCode() {
        const term = document.getElementById('terminal');
        const frame = document.getElementById('preview-frame');
        
        term.innerHTML += `<br><b>[System]</b> Running ${activeFile}...`;
        
        if(activeFile.endsWith('.html') || activeFile.endsWith('.css') || activeFile.endsWith('.js')) {
            const doc = `<html><head><style>${files['style.css']?.content || ''}</style></head><body>${files['index.html']?.content || ''}<script>${files['main.js']?.content || ''}<\/script></body></html>`;
            frame.srcdoc = doc;
            term.innerHTML += `<br><b>[System]</b> Web Preview Updated.`;
        } else {
            term.innerHTML += `<br><span style="color:#ef5350;">[Error]</span> Direct execution for ${activeFile.split('.').pop()} not available in browser. Use AI to simulate.`;
        }
        term.scrollTop = term.scrollHeight;
    }

    function downloadCode() {
        const blob = new Blob([editor.getValue()], {type: "text/plain"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = activeFile;
        a.click();
    }

    async function askAI() {
        const prompt = document.getElementById('ai-prompt').value;
        const history = document.getElementById('chat-history');
        const btn = document.getElementById('ai-btn');
        if(!prompt) return;

        history.innerHTML += `<div style="margin-bottom:10px; color:var(--accent);"><b>You:</b> ${prompt}</div>`;
        btn.innerText = "Thinking...";
        btn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/api/ai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ prompt, fileName: activeFile, fileContent: files[activeFile].content })
            });
            const data = await res.json();
            if(data.code) {
                editor.setValue(data.code);
                history.innerHTML += `<div style="margin-bottom:10px; color:#aaa;"><b>AI:</b> Updated the code for you! ✅</div>`;
            }
        } catch(e) { alert("AI Failed"); }
        
        btn.innerText = "Generate Code";
        btn.disabled = false;
        document.getElementById('ai-prompt').value = '';
        history.scrollTop = history.scrollHeight;
    }

    async function autoSave() {
        fetch(`${API_URL}/files/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ fileName: activeFile, content: files[activeFile].content })
        });
    }

    function logout() { localStorage.clear(); location.reload(); }
    if(localStorage.getItem('token')) initApp();
</script>
</body>
</html>