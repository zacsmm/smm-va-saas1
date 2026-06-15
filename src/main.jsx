import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const initialData = {
  clients: [],
  leads: [],
  tasks: [],
  posts: [],
};

function App() {
  const saved = JSON.parse(localStorage.getItem("freevanceData") || "null");
  const [data, setData] = useState(saved || initialData);
  const [page, setPage] = useState("dashboard");

  function save(next) {
    setData(next);
    localStorage.setItem("freevanceData", JSON.stringify(next));
  }

  function add(type, item) {
    save({
      ...data,
      [type]: [{ id: Date.now(), ...item }, ...data[type]],
    });
  }

  const stats = {
    clients: data.clients.length,
    leads: data.leads.length,
    tasks: data.tasks.filter((t) => t.status !== "Done").length,
    posts: data.posts.length,
  };

  return (
    <div className="app">
      <aside>
        <h1>FreeVAnce CRM</h1>
        <p className="tagline">Client & Lead Growth Tool for VAs</p>

        {[
          ["dashboard", "🏠 Dashboard"],
          ["clients", "👥 Clients"],
          ["leads", "🎯 Lead Generation"],
          ["tasks", "✅ Tasks"],
          ["calendar", "📅 Calendar"],
          ["ai", "🤖 AI VA Tools"],
          ["reports", "📊 Reports"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={page === id ? "active" : ""}
            onClick={() => setPage(id)}
          >
            {label}
          </button>
        ))}
      </aside>

      <main>
        {page === "dashboard" && <Dashboard stats={stats} data={data} />}
        {page === "clients" && <Clients add={add} data={data} />}
        {page === "leads" && <Leads add={add} data={data} />}
        {page === "tasks" && <Tasks add={add} data={data} save={save} />}
        {page === "calendar" && <Calendar add={add} data={data} />}
        {page === "ai" && <AITools />}
        {page === "reports" && <Reports data={data} />}
      </main>
    </div>
  );
}

function Dashboard({ stats, data }) {
  return (
    <>
      <div className="hero">
        <span>🚀 FreeVAnce CRM</span>
        <h2>Grow your VA business with smarter tools.</h2>
        <p>
          Manage clients, track leads, plan content, generate outreach, and
          stay organized in one dashboard.
        </p>
      </div>

      <div className="stats">
        <Card title="👥 Clients" value={stats.clients} />
        <Card title="🎯 Leads" value={stats.leads} />
        <Card title="✅ Open Tasks" value={stats.tasks} />
        <Card title="📅 Posts Planned" value={stats.posts} />
      </div>

      <section className="section">
        <h3>Quick VA Workflow</h3>
        <div className="cards">
          <div>Find leads</div>
          <div>Send outreach</div>
          <div>Book discovery calls</div>
          <div>Add clients</div>
          <div>Plan content</div>
          <div>Send reports</div>
        </div>
      </section>

      <section className="section">
        <h3>Recent Leads</h3>
        <div className="leadGrid">
          {data.leads.slice(0, 4).map((lead) => (
            <Item key={lead.id} title={lead.name} text={`${lead.status} • ${lead.source}`} />
          ))}
          {!data.leads.length && <p>No leads yet. Start with Lead Generation.</p>}
        </div>
      </section>
    </>
  );
}

function Clients({ add, data }) {
  const [client, setClient] = useState({
    name: "",
    email: "",
    niche: "",
    platform: "",
    notes: "",
  });

  function submit(e) {
    e.preventDefault();
    if (!client.name) return;
    add("clients", client);
    setClient({ name: "", email: "", niche: "", platform: "", notes: "" });
  }

  return (
    <>
      <Header title="Client Management" subtitle="Store client details, niche, platforms, and notes." />
      <form className="form" onSubmit={submit}>
        <input placeholder="Client / Brand name" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} />
        <input placeholder="Email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} />
        <input placeholder="Niche" value={client.niche} onChange={(e) => setClient({ ...client, niche: e.target.value })} />
        <input placeholder="Platform" value={client.platform} onChange={(e) => setClient({ ...client, platform: e.target.value })} />
        <textarea placeholder="Brand notes / guidelines" value={client.notes} onChange={(e) => setClient({ ...client, notes: e.target.value })} />
        <button>Add Client</button>
      </form>

      <div className="leadGrid">
        {data.clients.map((c) => (
          <Item key={c.id} title={c.name} text={`${c.email}\n${c.niche} • ${c.platform}\n${c.notes}`} />
        ))}
      </div>
    </>
  );
}

function Leads({ add, data }) {
  const [lead, setLead] = useState({
    name: "",
    email: "",
    niche: "",
    source: "",
    status: "Prospect",
    followUp: "",
  });

  function submit(e) {
    e.preventDefault();
    if (!lead.name) return;
    add("leads", lead);
    setLead({ name: "", email: "", niche: "", source: "", status: "Prospect", followUp: "" });
  }

  const prompts = [
    `"${lead.niche || "small business"}" "need social media manager"`,
    `site:facebook.com/groups "${lead.niche || "business owner"}" "social media help"`,
    `site:linkedin.com/in "${lead.niche || "founder"}" "marketing"`,
    `"${lead.niche || "local business"}" "contact us" Instagram`,
  ];

  return (
    <>
      <Header title="Lead Generation" subtitle="Find, track, and follow up with potential VA clients." />

      <form className="form" onSubmit={submit}>
        <input placeholder="Business / Lead Name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
        <input placeholder="Email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
        <input placeholder="Niche" value={lead.niche} onChange={(e) => setLead({ ...lead, niche: e.target.value })} />
        <input placeholder="Source" value={lead.source} onChange={(e) => setLead({ ...lead, source: e.target.value })} />
        <select value={lead.status} onChange={(e) => setLead({ ...lead, status: e.target.value })}>
          <option>Prospect</option>
          <option>Discovery Call</option>
          <option>Follow-up</option>
          <option>Closed Client</option>
          <option>Lost</option>
        </select>
        <input type="date" value={lead.followUp} onChange={(e) => setLead({ ...lead, followUp: e.target.value })} />
        <button>Add Lead</button>
      </form>

      <section className="section">
        <h3>Search Prompts</h3>
        {prompts.map((p, i) => (
          <div className="copyBox" key={i}>{p}</div>
        ))}
      </section>

      <div className="leadGrid">
        {data.leads.map((l) => (
          <Item key={l.id} title={l.name} text={`${l.email}\n${l.niche} • ${l.source}\nStatus: ${l.status}\nFollow-up: ${l.followUp || "Not set"}`} />
        ))}
      </div>
    </>
  );
}

function Tasks({ add, data, save }) {
  const [task, setTask] = useState({
    title: "",
    client: "",
    category: "Content Writing",
    due: "",
    status: "Pending",
  });

  function submit(e) {
    e.preventDefault();
    if (!task.title) return;
    add("tasks", task);
    setTask({ title: "", client: "", category: "Content Writing", due: "", status: "Pending" });
  }

  function markDone(id) {
    save({
      ...data,
      tasks: data.tasks.map((t) => t.id === id ? { ...t, status: "Done" } : t),
    });
  }

  return (
    <>
      <Header title="Task Management" subtitle="Track VA tasks like content writing, editing, design, and follow-ups." />
      <form className="form" onSubmit={submit}>
        <input placeholder="Task title" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
        <input placeholder="Client" value={task.client} onChange={(e) => setTask({ ...task, client: e.target.value })} />
        <select value={task.category} onChange={(e) => setTask({ ...task, category: e.target.value })}>
          <option>Content Writing</option>
          <option>Video Editing</option>
          <option>Graphic Design</option>
          <option>Lead Generation</option>
          <option>Client Follow-up</option>
        </select>
        <input type="date" value={task.due} onChange={(e) => setTask({ ...task, due: e.target.value })} />
        <button>Add Task</button>
      </form>

      <div className="leadGrid">
        {data.tasks.map((t) => (
          <div className="leadCard" key={t.id}>
            <h4>{t.title}</h4>
            <p>{t.client} • {t.category}</p>
            <p>Due: {t.due || "No due date"}</p>
            <span>{t.status}</span>
            {t.status !== "Done" && <button onClick={() => markDone(t.id)}>Mark Done</button>}
          </div>
        ))}
      </div>
    </>
  );
}

function Calendar({ add, data }) {
  const [post, setPost] = useState({
    topic: "",
    client: "",
    platform: "Instagram",
    date: "",
    status: "Idea",
  });

  function submit(e) {
    e.preventDefault();
    if (!post.topic) return;
    add("posts", post);
    setPost({ topic: "", client: "", platform: "Instagram", date: "", status: "Idea" });
  }

  return (
    <>
      <Header title="Content Calendar" subtitle="Plan content by client, platform, date, and status." />
      <form className="form" onSubmit={submit}>
        <input placeholder="Content topic" value={post.topic} onChange={(e) => setPost({ ...post, topic: e.target.value })} />
        <input placeholder="Client" value={post.client} onChange={(e) => setPost({ ...post, client: e.target.value })} />
        <select value={post.platform} onChange={(e) => setPost({ ...post, platform: e.target.value })}>
          <option>Facebook</option>
          <option>Instagram</option>
          <option>TikTok</option>
          <option>LinkedIn</option>
        </select>
        <select value={post.status} onChange={(e) => setPost({ ...post, status: e.target.value })}>
          <option>Idea</option>
          <option>Draft</option>
          <option>For Approval</option>
          <option>Scheduled</option>
          <option>Posted</option>
        </select>
        <input type="date" value={post.date} onChange={(e) => setPost({ ...post, date: e.target.value })} />
        <button>Add Content</button>
      </form>

      <div className="leadGrid">
        {data.posts.map((p) => (
          <Item key={p.id} title={p.topic} text={`${p.client}\n${p.platform} • ${p.date}\nStatus: ${p.status}`} />
        ))}
      </div>
    </>
  );
}

function AITools() {
  const [input, setInput] = useState({
    platform: "TikTok",
    type: "Caption",
    niche: "",
    offer: "",
  });

  const result = ` ${input.type} for ${input.platform}

Stop scrolling — if you're a ${input.niche || "business owner"}, this is your sign to simplify your content strategy.

You don't need to post randomly. You need clear content that attracts the right people and shows why your ${input.offer || "service"} matters.

CTA: Save this and follow for more tips.

#virtualassistant #socialmediamarketing #smallbusiness #contentstrategy`;

  return (
    <>
      <Header title="AI VA Tools" subtitle="Generate captions, hooks, CTAs, and hashtags for client work." />
      <div className="form">
        <select value={input.platform} onChange={(e) => setInput({ ...input, platform: e.target.value })}>
          <option>Facebook</option>
          <option>Instagram</option>
          <option>TikTok</option>
          <option>LinkedIn</option>
        </select>
        <select value={input.type} onChange={(e) => setInput({ ...input, type: e.target.value })}>
          <option>Caption</option>
          <option>Hook</option>
          <option>CTA</option>
          <option>Hashtags</option>
          <option>Cold DM</option>
        </select>
        <input placeholder="Client niche" value={input.niche} onChange={(e) => setInput({ ...input, niche: e.target.value })} />
        <input placeholder="Offer / service" value={input.offer} onChange={(e) => setInput({ ...input, offer: e.target.value })} />
      </div>
      <div className="output">{result}</div>
    </>
  );
}

function Reports({ data }) {
  return (
    <>
      <Header title="Reports" subtitle="Simple VA business summary." />
      <button onClick={() => window.print()} className="printBtn">Export PDF</button>
      <div className="stats">
        <Card title="Clients" value={data.clients.length} />
        <Card title="Leads" value={data.leads.length} />
        <Card title="Tasks" value={data.tasks.length} />
        <Card title="Posts" value={data.posts.length} />
      </div>
    </>
  );
}

function Header({ title, subtitle }) {
  return (
    <>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </>
  );
}

function Card({ title, value }) {
  return (
    <div className="statCard">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Item({ title, text }) {
  return (
    <div className="leadCard">
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
