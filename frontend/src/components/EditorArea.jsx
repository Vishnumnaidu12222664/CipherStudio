import React from "react";
import Editor from "@monaco-editor/react";

export default function EditorArea({ path, code, onChange, theme }) {
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{padding:8,borderBottom:"1px solid rgba(0,0,0,0.06)"}}>{path}</div>
      <div style={{flex:1}}>
        <Editor
          theme={theme === "dark" ? "vs-dark" : "light"}
          defaultLanguage="javascript"
          value={code}
          onChange={(val)=>onChange(val || "")}
          options={{
            minimap:{enabled:false},
            fontSize:14,
            wordWrap:"on",
            automaticLayout:true
          }}
        />
      </div>
    </div>
  );
}
