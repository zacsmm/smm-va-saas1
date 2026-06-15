import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  const [page, setPage] = useState("dashboard");
  const [leads, setLeads] = useState([]);

  const [lead, setLead] = useState({
    name: "",
    email: "",
    phone: "",
    niche: "",
    source: "",
    status: "Prospect",
    followUpDate: "",
    notes: "",
  });

  const [outreach, setOutreach] = useState({
    businessName: "",
    niche: "",
    service: "Social Media Management",
    tone: "Friendly",
  });

  function addLead(e) {
    e.preventDefault();
    if (!lead.name) return;

    setLeads([...leads, { ...lead, id: Date.now() }]);

    setLead({
      name: "",
      email: "",
      phone: "",
      niche: "",
      source: "",
      status: "Prospect",
      followUpDate: "",
      notes: "",
    });
  }

  function generateOutreach() {
    const { businessName, niche, service, tone } = outreach;

    return `Hi ${businessName || "there"}! I noticed your ${niche || "business"} and really liked what you're doing.

I help businesses improve their online presence through ${service}. I can help with content ideas, posting consistency, captions, engagement, and lead generation.

Would you be open to a quick chat this week to see if I can help you grow your social media?`;
  }

  function generateSearchPrompts() {
    return [
      `site:facebook.com/groups "${outreach.niche || "small business"}" "looking for social media help"`,
      `site:linkedin.com/in "${outreach.niche || "business owner"}" "${outreach.service}"`,
      `"${outreach.niche || "local business"}" "contact us" "Instagram"`,
      `"${outreach.niche || "business"}" "we need help with social media"`,
      `"${outreach.niche || "startup"}" "marketing manager" "email"`,
    ];
  }

  return (
    <div className="app">
      <aside>
        <h1>FreeVAnce Tool</h1>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("clients")}>Clients</button>
        <button onClick={() => setPage("calendar")}>Calendar</button>
        <button onClick={() => setPage("approvals")}>Approvals</button>
        <button onClick={() => setPage("ai")}>AI Captions</button>
        <button onClick={() => setPage("leads")}>Lead Generation</button>
      </aside>

      <main>
        {page === "dashboard" && (
          <>
            <h2>Dashboard</h2>
            <p>Your FreeVAnce Tool app is working successfully.</p>

            <div className="cards">
              <div>Client Management</div>
              <div>Content Calendar</div>
              <div>Approval System</div>
              <div>AI Caption Generator</div>
              <div>Lead Generation Tools</div>
            </div>
          </>
        )}

        {page === "clients" && (
          <>
            <h2>Clients</h2>
            <p>Client management tools will go here.</p>
          </>
        )}

        {page === "calendar" && (
          <>
            <h2>Calendar</h2>
            <p>Content calendar tools will go here.</p>
          </>
        )}

        {page === "approvals" && (
          <>
            <h2>Approvals</h2>
            <p>Content approval tools will go here.</p>
          </>
        )}

        {page === "ai" && (
          <>
            <h2>AI Captions</h2>
            <p>AI caption generator will go here.</p>
          </>
        )}

        {page === "leads" && (
          <>
            <h2>Lead Generation Tools</h2>
            <p>Find, track, and follow up with potential clients.</p>

            <div className="section">
              <h3>Add Lead</h3>

              <form onSubmit={addLead} className="form">
                <input
                  placeholder="Business / Prospect Name"
                  value={lead.name}
                  onChange={(e) => setLead({ ...lead, name: e.target.value })}
                />

                <input
                  placeholder="Email"
                  value={lead.email}
                  onChange={(e) => setLead({ ...lead, email: e.target.value })}
                />

                <input
                  placeholder="Phone"
                  value={lead.phone}
                  onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                />

                <input
                  placeholder="Niche ex. Real Estate, Restaurant"
                  value={lead.niche}
                  onChange={(e) => setLead({ ...lead, niche: e.target.value })}
                />

                <input
                  placeholder="Source ex. Facebook, Google, LinkedIn"
                  value={lead.source}
                  onChange={(e) => setLead({ ...lead, source: e.target.value })}
                />

                <select
                  value={lead.status}
                  onChange={(e) => setLead({ ...lead, status: e.target.value })}
                >
                  <option>Prospect</option>
                  <option>Discovery Call</option>
                  <option>Follow-up</option>
                  <option>Closed Client</option>
                  <option>Lost</option>
                </select>

                <input
                  type="date"
                  value={lead.followUpDate}
                  onChange={(e) =>
                    setLead({ ...lead, followUpDate: e.target.value })
                  }
                />

                <textarea
                  placeholder="Notes"
                  value={lead.notes}
                  onChange={(e) => setLead({ ...lead, notes: e.target.value })}
                />

                <button type="submit">Add Lead</button>
              </form>
            </div>

            <div className="section">
              <h3>Outreach Message Generator</h3>

              <div className="form">
                <input
                  placeholder="Business Name"
                  value={outreach.businessName}
                  onChange={(e) =>
                    setOutreach({
                      ...outreach,
                      businessName: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Niche"
                  value={outreach.niche}
                  onChange={(e) =>
                    setOutreach({ ...outreach, niche: e.target.value })
                  }
                />

                <select
                  value={outreach.service}
                  onChange={(e) =>
                    setOutreach({ ...outreach, service: e.target.value })
                  }
                >
                  <option>Social Media Management</option>
                  <option>Content Creation</option>
                  <option>Lead Generation</option>
                  <option>Virtual Assistance</option>
                  <option>Video Editing</option>
                </select>

                <select
                  value={outreach.tone}
                  onChange={(e) =>
                    setOutreach({ ...outreach, tone: e.target.value })
                  }
                >
                  <option>Friendly</option>
                  <option>Professional</option>
                  <option>Short</option>
                </select>
              </div>

              <div className="output">
                <h4>Generated Message</h4>
                <p>{generateOutreach()}</p>
              </div>
            </div>

            <div className="section">
              <h3>Lead Search Prompts</h3>
              <p>Copy these into Google, Facebook, or LinkedIn search.</p>

              <div className="list">
                {generateSearchPrompts().map((prompt, index) => (
                  <div key={index} className="copyBox">
                    {prompt}
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>Lead Tracker</h3>

              <div className="leadGrid">
                {leads.length === 0 && <p>No leads added yet.</p>}

                {leads.map((item) => (
                  <div className="leadCard" key={item.id}>
                    <h4>{item.name}</h4>
                    <p>{item.email}</p>
                    <p>{item.phone}</p>
                    <p>Niche: {item.niche}</p>
                    <p>Source: {item.source}</p>
                    <span>{item.status}</span>
                    <p>Follow-up: {item.followUpDate || "Not set"}</p>
                    <p>{item.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
