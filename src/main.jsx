import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <div className="app">
      <aside>
        <h1>SMM VA SaaS</h1>
        <button>Dashboard</button>
        <button>Clients</button>
        <button>Calendar</button>
        <button>Approvals</button>
        <button>AI Captions</button>
      </aside>

      <main>
        <h2>Dashboard</h2>
        <p>Your app is working successfully.</p>

        <div className="cards">
          <div>Client Management</div>
          <div>Content Calendar</div>
          <div>Approval System</div>
          <div>AI Caption Generator</div>
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
