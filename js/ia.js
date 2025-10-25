export async function explain(method, context, prompt) {
  const res = await fetch("https://simplex.saulalopezg.workers.dev/explain", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      // PRUEBA: fuerzo un modelo estable para descartar modelo no disponible
      model: "models/gemini-1.5-flash",
      method,
      context,
      prompt
    })
  });
  let data = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    console.error("❌ Worker error payload:", data);
    throw new Error(data?.detail || data?.error || `HTTP ${res.status}`);
  }
  return data.text;
}
