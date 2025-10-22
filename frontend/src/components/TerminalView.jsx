import React, { useEffect, useState } from "react";

export default function TerminalView({ sandpack }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!sandpack?.listen) return;
    const unsubscribe = sandpack.listen((msg) => {
      if (msg.type === "console") {
        setLogs((prev) => [
          ...prev,
          `${msg.log.method.toUpperCase()}: ${msg.log.data.join(" ")}`
        ]);
      }
    });
    return () => unsubscribe();
  }, [sandpack]);

  return (
    <div className="terminal">
      {logs.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}
      <div style={{ marginTop: 12, fontSize: 12, color: "#9ca3af" }}>
        (Real-time console output)
      </div>
    </div>
  );
}
