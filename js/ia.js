// js/ia.js
const WORKER_URL = "https://simplex.saulalopezg.workers.dev/explain";

// si quieres, puedes también mandar model, pero el worker ya fija gemini-2.5-flash
export async function explain(method, context, prompt) {
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ method, context, prompt })
  });

  let data = {};
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    console.error("❌ Worker error payload:", data);
    const diag = data?.diag ? `\nDiag: ${JSON.stringify(data.diag)}` : "";
    throw new Error((data?.detail || data?.error || `HTTP ${res.status}`) + diag);
  }

  if (!data?.text) {
    console.warn("⚠️ Texto vacío. Payload:", data);
    throw new Error("[IA] Respuesta vacía.");
  }
  return data.text;
}

export function renderMarkdown(md, targetEl) {
  targetEl.innerHTML = "";
  const pre = document.createElement("pre");
  pre.style.whiteSpace = "pre-wrap";
  pre.textContent = md || "[IA] Respuesta vacía.";
  targetEl.appendChild(pre);
}
