// ia.js  (frontend, se carga con type="module")
export async function explain(method, context, prompt) {
  const res = await fetch("https://simplex.saulalopezg.workers.dev/explain", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: "models/gemini-2.5-flash",
      method,
      context,
      prompt
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || data?.error || "Error");
  return data.text;
}

export function renderMarkdown(md, targetEl) {
  targetEl.innerHTML = "";
  const pre = document.createElement("pre");
  pre.style.whiteSpace = "pre-wrap";
  pre.textContent = md || "[IA] Respuesta vacía.";
  targetEl.appendChild(pre);
}
