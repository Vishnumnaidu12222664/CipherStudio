import React, { useState, useEffect, useRef } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import SplitPane from "react-split-pane";
import FileTree from "./components/FileTree";
import EditorArea from "./components/EditorArea";
import { v4 as uuidv4 } from "uuid";
import { saveProjectToLocal, loadProjectFromLocal } from "./utils/storage";
import TerminalView from "./components/TerminalView";

const defaultFiles = {
  "/src/index.js": {
    code: `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);`,
  },
  "/src/App.js": {
    code: `import React from "react";
export default function App(){
  return <div style={{padding:20}}>Hello from CipherStudio!</div>
}`,
  },
  "/package.json": {
    code: `{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest"
  }
}`,
  },
};

export default function App() {
  // project state
  const [projectId, setProjectId] = useState(() => {
    const loaded = loadProjectFromLocal();
    return (loaded && loaded.projectId) || uuidv4();
  });
  const [files, setFiles] = useState(() => {
    const loaded = loadProjectFromLocal();
    return (loaded && loaded.files) || defaultFiles;
  });

  const [activePath, setActivePath] = useState(Object.keys(files)[0] || "/src/App.js");
  const [view, setView] = useState("preview"); // preview | terminal
  const [theme, setTheme] = useState(() => localStorage.getItem("cipher_theme") || "light");
  const [autosave, setAutosave] = useState(() => JSON.parse(localStorage.getItem("cipher_autosave") || "true"));
  const autosaveTimer = useRef(null);
  const [status, setStatus] = useState("Ready");

  // update DOM theme attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cipher_theme", theme);
  }, [theme]);

  // autosave to localStorage
  useEffect(() => {
    saveProjectToLocal({ projectId, files });
  }, [projectId, files]);

  // autosave throttle when editing
  const scheduleAutosave = () => {
    if (!autosave) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveProjectToLocal({ projectId, files });
      setStatus("Saved (autosave)");
    }, 800);
  };

  // file operations
  const handleCreateFile = (path) => {
    if (files[path]) {
      alert("File already exists");
      return;
    }
    setFiles((prev) => ({ ...prev, [path]: { code: "// new file" } }));
    setActivePath(path);
    setStatus("File created");
  };

  const handleDeleteFile = (path) => {
    const c = window.confirm("Delete " + path + " ?");
    if (!c) return;
    setFiles((prev) => {
      const copy = { ...prev };
      delete copy[path];
      return copy;
    });
    const remaining = Object.keys(files).filter((k) => k !== path);
    setActivePath(remaining[0] || "");
    setStatus("File deleted");
  };

  const handleRename = (oldPath, newPath) => {
    if (!newPath || oldPath === newPath) return;
    if (files[newPath]) {
      alert("Target path exists");
      return;
    }
    setFiles((prev) => {
      const copy = { ...prev };
      copy[newPath] = copy[oldPath];
      delete copy[oldPath];
      return copy;
    });
    if (activePath === oldPath) setActivePath(newPath);
    setStatus("Renamed");
  };

  const handleUpdateCode = (path, code) => {
    setFiles((prev) => ({ ...prev, [path]: { ...prev[path], code } }));
    scheduleAutosave();
    setStatus("Editing...");
  };

  // Sandpack expects files without leading slash and code as string or {code:...}
  const sandpackFiles = Object.fromEntries(
    Object.entries(files).map(([p, v]) => [p.replace(/^\//, ""), { code: v.code }])
  );

  // Save/load server
  const saveToServer = async () => {
    try {
      await fetch("http://localhost:4000/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, files }),
      });
      setStatus("Saved to server");
      alert("Saved to server 👍\nProjectId: " + projectId);
    } catch (e) {
      setStatus("Server save failed");
      alert("Save failed. Is server running?");
    }
  };

  const loadFromServer = async () => {
    const id = prompt("Enter projectId to load:");
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:4000/load/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setFiles(data.files);
      setProjectId(data.projectId);
      setActivePath(Object.keys(data.files)[0] || "");
      setStatus("Loaded from server");
      alert("Loaded project");
    } catch (e) {
      alert("Load failed. Check projectId and server.");
    }
  };

  // quick export/import (download/upload JSON)
  const exportProject = () => {
    const blob = new Blob([JSON.stringify({ projectId, files }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cipher_${projectId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importProject = (ev) => {
    const f = ev.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        if (obj.files) {
          setFiles(obj.files);
          setProjectId(obj.projectId || uuidv4());
          setActivePath(Object.keys(obj.files)[0] || "");
          setStatus("Imported project");
        } else alert("Invalid file");
      } catch (e) {
        alert("Invalid JSON");
      }
    };
    reader.readAsText(f);
  };

  return (
    <div className="app" style={{ height: "100vh" }}>
      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <div className="header">
          <strong>CipherStudio</strong>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            ID: {projectId.slice(0, 8)}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="toolbar">
            <button className="btn small" onClick={() => navigator.clipboard.writeText(projectId)}>
              Copy ID
            </button>
            <button className="btn small" onClick={saveToServer}>
              Save
            </button>
            <button className="btn small" onClick={loadFromServer}>
              Load
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
          <div className="switch">
            <label style={{ fontSize: 13, color: "var(--muted)" }}>Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{ marginLeft: 6, padding: 6 }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="switch" style={{ marginLeft: "auto" }}>
            <label style={{ fontSize: 13, color: "var(--muted)" }}>Autosave</label>
            <input
              type="checkbox"
              checked={autosave}
              onChange={(e) => {
                setAutosave(e.target.checked);
                localStorage.setItem("cipher_autosave", JSON.stringify(e.target.checked));
              }}
              style={{ marginLeft: 6 }}
            />
          </div>
        </div>

        <div style={{ marginTop: 8, flex: 1, display: "flex", flexDirection: "column" }}>
          <FileTree
            files={files}
            activePath={activePath}
            onCreate={handleCreateFile}
            onDelete={handleDeleteFile}
            onSelect={setActivePath}
            onRename={handleRename}
          />
        </div>

        <div className="bottom-panel">
          <input type="file" accept="application/json" onChange={importProject} />
          <button className="btn small" onClick={exportProject}>
            Export
          </button>
          <button
            className="btn ghost small"
            onClick={() => {
              saveProjectToLocal({ projectId, files });
              setStatus("Saved locally");
            }}
          >
            Save Local
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT AREA WITH SPLIT PANES */}
      <div className="main" style={{ flex: 1 }}>
        <SplitPane split="vertical" minSize={400} defaultSize="60%">
          {/* LEFT MAIN SECTION (CODE + TERMINAL) */}
          <SplitPane split="horizontal" minSize={200} defaultSize="65%">
            {/* CODE EDITOR SECTION */}
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <div className="header" style={{ borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: 6 }}>
                <strong>{activePath}</strong>
                <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 12 }}>{status}</span>
              </div>
              <div style={{ flex: 1 }}>
                <EditorArea
                  path={activePath}
                  code={files[activePath]?.code || ""}
                  onChange={(code) => handleUpdateCode(activePath, code)}
                  theme={theme}
                />
              </div>
            </div>

            {/* TERMINAL SECTION */}

<TerminalView sandpack={window.sandpack} />

          </SplitPane>

          {/* RIGHT PREVIEW SECTION */}
          <div style={{ background: "var(--panel)", height: "100%" }}>
            <div className="header" style={{ borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: 6 }}>
              <strong>Live Preview</strong>
            </div>
            <Sandpack
              template="react"
              files={Object.fromEntries(Object.entries(files).map(([p, v]) => [p.replace(/^\//, ""), { code: v.code }]))}
              customSetup={{ entry: "src/index.js" }}
              options={{ showConsole: false, showTabs: true }}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        </SplitPane>
      </div>
    </div>
  );
}
