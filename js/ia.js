const WORKER_URL = "https://simplex.saulalopezg.workers.dev/explain";

export async function explain(method, context, prompt) {
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: "gemini-2.5-flash",
      method,
      context,
      prompt
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || data?.error || "Error");
  return data.text;
}
