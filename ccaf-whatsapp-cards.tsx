import { useState } from "react"

const TC = "#8B3A2A"
const TCL = "#F9EDE9"

const DOMAINS = [
  "D1 · Agentic Architecture",
  "D2 · Tool Design & MCP",
  "D3 · Claude Code Config",
  "D4 · Prompt Engineering",
  "D5 · Context Management",
]
const WEEKS = ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10"]

const TYPES = [
  { id:"trap",     emoji:"🔴", label:"Trap caught",     desc:"Wrong answer, now understood" },
  { id:"click",    emoji:"💡", label:"Concept clicked", desc:"Something that finally made sense" },
  { id:"concept",  emoji:"🧠", label:"New concept",     desc:"Explaining something new" },
  { id:"resource", emoji:"📖", label:"Useful resource", desc:"Doc or section worth reading" },
  { id:"note",     emoji:"💬", label:"Quick note",      desc:"Anything else" },
]

const FIELDS = {
  trap: [
    { k:"domain",  label:"Domain",                      t:"sel",  opts:DOMAINS },
    { k:"week",    label:"Week",                        t:"sel",  opts:WEEKS },
    { k:"concept", label:"Concept being tested",        t:"text", ph:"e.g. coordinator-subagent isolation" },
    { k:"wrong",   label:"My wrong assumption",         t:"area", ph:"I thought..." },
    { k:"correct", label:"What is actually true",       t:"area", ph:"Actually..." },
    { k:"hook",    label:"One line to remember",        t:"text", ph:"The key distinction is..." },
  ],
  click: [
    { k:"domain",    label:"Domain",                    t:"sel",  opts:DOMAINS },
    { k:"concept",   label:"Concept name",              t:"text", ph:"e.g. tool_choice: any vs auto" },
    { k:"analogy",   label:"Analogy (plain language)",  t:"area", ph:"Like a..." },
    { k:"technical", label:"Technical reality",         t:"area", ph:"What actually happens..." },
    { k:"exam",      label:"Exam angle",                t:"text", ph:"How it shows up in questions..." },
  ],
  concept: [
    { k:"domain", label:"Domain",                        t:"sel",  opts:DOMAINS },
    { k:"name",   label:"Concept name",                  t:"text", ph:"e.g. PostToolUse hook" },
    { k:"what",   label:"What it is (plain language)",   t:"area", ph:"Plain explanation..." },
    { k:"how",    label:"How it works (technical)",      t:"area", ph:"Technical detail..." },
    { k:"exam",   label:"What the exam tests for",       t:"text", ph:"The trap is usually..." },
  ],
  resource: [
    { k:"domain",   label:"Domain",          t:"sel",  opts:DOMAINS },
    { k:"page",     label:"Page or URL",     t:"text", ph:"docs.anthropic.com/..." },
    { k:"section",  label:"Specific section",t:"text", ph:"e.g. Tool choice parameter" },
    { k:"why",      label:"Why it matters",  t:"area", ph:"This is useful because..." },
  ],
  note: [
    { k:"domain", label:"Domain (optional)", t:"sel",  opts:["— any —",...DOMAINS] },
    { k:"body",   label:"Your note",         t:"area", ph:"Type anything..." },
  ],
}

const buildMsg = (type, d) => {
  const dom = d.domain && d.domain !== "— any —" ? d.domain : null
  if (type === "trap") return [
    `🔴 *Trap caught · ${dom||"D?"} · ${d.week||"W?"}*`,
    "",
    `Concept: _${d.concept||"—"}_`,
    "",
    `❌ *Wrong assumption:*`,
    d.wrong||"—",
    "",
    `✅ *What is actually true:*`,
    d.correct||"—",
    "",
    `💬 ${d.hook||"—"}`,
  ].join("\n")

  if (type === "click") return [
    `💡 *Just clicked · ${dom||"D?"}*`,
    "",
    `*${d.concept||"—"}*`,
    "",
    `*Analogy:* ${d.analogy||"—"}`,
    "",
    `*Technical:* ${d.technical||"—"}`,
    "",
    `*Exam angle:* ${d.exam||"—"}`,
  ].join("\n")

  if (type === "concept") return [
    `🧠 *New concept · ${dom||"D?"}*`,
    "",
    `*${d.name||"—"}*`,
    "",
    `*What it is:* ${d.what||"—"}`,
    "",
    `*How it works:* ${d.how||"—"}`,
    "",
    `*Exam tests:* ${d.exam||"—"}`,
  ].join("\n")

  if (type === "resource") return [
    `📖 *Worth reading · ${dom||"D?"}*`,
    "",
    `${d.page||"—"}`,
    `_${d.section||"—"}_`,
    "",
    `*Why:* ${d.why||"—"}`,
  ].join("\n")

  if (type === "note") return [
    `💬 *Note${dom ? " · "+dom : ""}*`,
    "",
    d.body||"—",
  ].join("\n")

  return ""
}

// Render WhatsApp markup visually in the preview
function WaText({ text }) {
  const lines = text.split("\n")
  return (
    <div>
      {lines.map((line, li) => {
        if (!line) return <div key={li} style={{height:6}}/>
        const parts = line.split(/(\*[^*]+\*|_[^_]+_)/g)
        return (
          <div key={li} style={{lineHeight:1.55}}>
            {parts.map((p, i) => {
              if (p.startsWith("*") && p.endsWith("*"))
                return <strong key={i}>{p.slice(1,-1)}</strong>
              if (p.startsWith("_") && p.endsWith("_"))
                return <em key={i}>{p.slice(1,-1)}</em>
              return <span key={i}>{p}</span>
            })}
          </div>
        )
      })}
    </div>
  )
}

const inp = {
  width:"100%", padding:"8px 10px",
  border:"1px solid #E5E7EB", borderRadius:4,
  fontSize:13, fontFamily:"system-ui,sans-serif",
  color:"#111827", background:"#fff",
  marginTop:4, boxSizing:"border-box",
} as any

export default function WaCards() {
  const [type, setType] = useState("trap")
  const [data, setData] = useState({})
  const [copied, setCopied] = useState(false)

  const set = (k,v) => setData(p=>({...p,[k]:v}))
  const msg = buildMsg(type, data)

  const copy = () => {
    navigator.clipboard.writeText(msg)
    setCopied(true)
    setTimeout(()=>setCopied(false), 2200)
  }

  return (
    <div style={{fontFamily:"system-ui,sans-serif", maxWidth:560, margin:"0 auto", padding:"16px 0"}}>

      {/* Type pills */}
      <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:22}}>
        {TYPES.map(t => (
          <button key={t.id} onClick={()=>{setType(t.id);setData({})}}
            style={{
              padding:"7px 13px", borderRadius:4, cursor:"pointer",
              border: type===t.id ? `1.5px solid ${TC}` : "1.5px solid #E5E7EB",
              background: type===t.id ? TCL : "#fff",
              color: type===t.id ? TC : "#4B5563",
              fontSize:13, fontWeight: type===t.id ? 500 : 400,
              fontFamily:"system-ui,sans-serif",
              display:"flex", alignItems:"center", gap:5,
              transition:"all .15s",
            }}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Selected type description */}
      <div style={{fontSize:12, color:"#9CA3AF", marginBottom:18, letterSpacing:".05em"}}>
        {TYPES.find(t=>t.id===type)?.desc}
      </div>

      {/* Fields */}
      <div style={{marginBottom:20}}>
        {FIELDS[type].map(f => (
          <div key={f.k} style={{marginBottom:12}}>
            <label style={{fontSize:12, color:"#4B5563", fontWeight:500, display:"block"}}>{f.label}</label>
            {f.t === "sel" ? (
              <select value={data[f.k]||""} onChange={e=>set(f.k,e.target.value)} style={inp}>
                <option value="">— select —</option>
                {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.t === "area" ? (
              <textarea rows={3} placeholder={f.ph} value={data[f.k]||""}
                onChange={e=>set(f.k,e.target.value)}
                style={{...inp, resize:"vertical", lineHeight:1.5}}/>
            ) : (
              <input type="text" placeholder={f.ph} value={data[f.k]||""}
                onChange={e=>set(f.k,e.target.value)} style={inp}/>
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{borderTop:"1px solid #F3F4F6", marginBottom:18}}/>

      {/* WhatsApp preview */}
      <div style={{fontSize:11, color:"#9CA3AF", letterSpacing:".1em", textTransform:"uppercase", fontWeight:500, marginBottom:10}}>
        Preview
      </div>
      <div style={{background:"#ECE5DD", borderRadius:8, padding:"14px 14px 18px", marginBottom:12}}>
        <div style={{
          background:"#fff", borderRadius:"10px 10px 10px 3px",
          padding:"10px 14px", fontSize:13.5, color:"#111827",
          boxShadow:"0 1px 2px rgba(0,0,0,.08)", maxWidth:"88%",
          fontFamily:"system-ui,sans-serif",
        }}>
          <WaText text={msg}/>
          <div style={{fontSize:11, color:"#9CA3AF", marginTop:6, textAlign:"right"}}>now</div>
        </div>
      </div>

      {/* Copy button */}
      <button onClick={copy} style={{
        width:"100%", padding:"11px", borderRadius:4, border:"none",
        background: copied ? "#059669" : TC,
        color:"#fff", fontSize:13, fontWeight:500, cursor:"pointer",
        fontFamily:"system-ui,sans-serif", letterSpacing:".06em",
        transition:"background .2s",
      }}>
        {copied ? "✓ Copied — paste into WhatsApp" : "Copy for WhatsApp"}
      </button>
      <div style={{fontSize:11, color:"#9CA3AF", marginTop:7, textAlign:"center"}}>
        *bold* and _italic_ render automatically in WhatsApp
      </div>

    </div>
  )
}
