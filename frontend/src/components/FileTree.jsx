import React, { useState } from "react";

/*
 props:
  files: { "/src/App.js": {code: '...' } }
  activePath, onCreate(path), onDelete(path), onSelect(path), onRename(oldPath, newPath)
*/
export default function FileTree({ files, activePath, onCreate, onDelete, onSelect, onRename }) {
  const [newName, setNewName] = useState("");
  const [newFolder, setNewFolder] = useState("");
  const [renameInfo, setRenameInfo] = useState({});

  // group by first folder after leading slash
  const grouped = {};
  Object.keys(files).forEach((p) => {
    const parts = p.split("/").filter(Boolean);
    if (parts.length <= 1) {
      grouped.root = grouped.root || [];
      grouped.root.push(p);
    } else {
      const folder = parts[0];
      grouped[folder] = grouped[folder] || [];
      grouped[folder].push(p);
    }
  });

  return (
    <div>
      <h4>Files</h4>
      <div className="files-list">
        {/* root */}
        {grouped.root?.map((p) => (
          <div key={p} className={`file-item ${p===activePath ? "active":""}`}>
            {renameInfo[p] ? (
              <>
                <input className="inline-input" defaultValue={p} onBlur={(e)=>{ onRename(p, e.target.value); setRenameInfo({}); }} />
              </>
            ) : (
              <>
                <span className="name" onClick={()=>onSelect(p)}>{p}</span>
                <div style={{display:"flex",gap:6}}>
                  <button className="btn ghost small" onClick={()=>setRenameInfo({[p]:true})}>Rename</button>
                  <button className="btn ghost small" onClick={()=>onDelete(p)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* folders */}
        {Object.keys(grouped).filter(k=>k!=="root").map((folder) => (
          <div key={folder}>
            <div className="folder">📁 {folder}</div>
            <div style={{paddingLeft:10}}>
              {grouped[folder].map((p) => (
                <div key={p} className={`file-item ${p===activePath ? "active":""}`}>
                  {renameInfo[p] ? (
                    <input className="inline-input" defaultValue={p} onBlur={(e)=>{ onRename(p, e.target.value); setRenameInfo({}); }} />
                  ) : (
                    <>
                      <span className="name" onClick={()=>onSelect(p)}>{p.split("/").slice(-1)[0]}</span>
                      <div style={{display:"flex",gap:6}}>
                        <button className="btn ghost small" onClick={()=>setRenameInfo({[p]:true})}>Rename</button>
                        <button className="btn ghost small" onClick={()=>onDelete(p)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="create-row">
        <input className="inline-input" placeholder="/src/NewFile.js" value={newName} onChange={(e)=>setNewName(e.target.value)} />
        <button className="btn small" onClick={()=>{ if(newName){ onCreate(newName); setNewName(""); } }}>Create</button>
      </div>

      <div style={{marginTop:8}}>
        <input className="inline-input" placeholder="src/newFolder (no leading slash)" value={newFolder} onChange={(e)=>setNewFolder(e.target.value)} />
        <button className="btn small" onClick={()=>{ if(newFolder){ onCreate(`/${newFolder}/index.js`); setNewFolder(""); } }}>Create Folder</button>
      </div>
    </div>
  );
}
