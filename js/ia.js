// js/ia.js
const WORKER_URL = "https://simplex.saulalopezg.workers.dev/explain";
const MODEL = "gemini-2.5-flash"; // o "gemini-pro" si es el que dejaste activo

export async function explain(method, context, prompt) {
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, method, context, prompt })
  });

  let data = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    console.error("❌ Worker error payload:", data);
    throw new Error(data?.detail || data?.error || `HTTP ${res.status}`);
  }
  return data.text;
}

export function renderMarkdown(md, targetEl) {
  // Render simple; si quieres, luego cambiamos a un parser markdown real
  targetEl.innerHTML = "";
  const pre = document.createElement("pre");
  pre.style.whiteSpace = "pre-wrap";
  pre.textContent = md || "[IA] Respuesta vacía.";
  targetEl.appendChild(pre);
}
