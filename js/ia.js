// js/ia.js
const WORKER_URL = "https://simplex.saulalopezg.workers.dev/explain";
const MODEL = "gemini-1.5-flash";

export async function explain(method, context, prompt) {
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, method, context, prompt })
  });

  let data = {};
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    console.error("❌ Worker error payload (full):", data);
    // Saca el primer intento con detalle (si existe):
    const first = Array.isArray(data?.tried) ? data.tried[0] : null;
    if (first) {
      // Muestra todo para depurar rápidamente
      console.error("❌ First tried:", first);
      // Lanza un error legible en pantalla
      const msg = `[${first.status}] ${first.base} / ${first.model}\n${first.detail || "(sin detail)"}`;
      throw new Error(msg);
    }
    throw new Error(data?.detail || data?.error || `HTTP ${res.status}`);
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
