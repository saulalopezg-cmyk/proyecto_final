// server/api.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 8787;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------- SERVE ESTÁTICO (si quieres servir /public desde el mismo server)
app.use(express.static(path.join(__dirname, '..', 'public')));

// ---------- HELPERS
function makeSystemInstruction() {
  return [
    'Eres un tutor de Investigación de Operaciones.',
    'Explica SIEMPRE en Markdown con estas secciones:',
    '1) Planteamiento',
    '2) Método/Algoritmo',
    '3) Desarrollo paso a paso (sin saltos)',
    '4) Resultado y validación',
    '5) Notas/alternativas si aplica',
    '',
    'Reglas por método:',
    '- Simplex: tableau inicial, elección de pivotes en cada iteración, criterio de parada, solución (variables básicas/no básicas) y valor óptimo.',
    '- Transporte: balanceo, solución inicial (NW, costo mínimo o Vogel), mejoras (u-v o ciclos), costo total y prueba de optimalidad.',
    '- Asignación (Método Húngaro): reducción por filas y columnas, cobertura mínima de ceros, construcción/ajuste de matriz, trazado de líneas, asignaciones, manejo de empates, y validación (costo total mínimo).',
    'Si faltan datos, lista exactamente qué falta y cómo obtenerlo.'
  ].join('\n');
}

async function generateMarkdown({ model = 'gemini-2.5-pro', prompt, context }) {
  const modelInstance = genAI.getGenerativeModel({
    model,
    systemInstruction: makeSystemInstruction(),
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048,
      responseMimeType: 'text/markdown'
    }
  });

  const userText = [
    'Contexto del problema (JSON):',
    '```json',
    JSON.stringify(context ?? {}, null, 2),
    '```',
    '',
    'Instrucción:',
    prompt
  ].join('\n');

  const result = await modelInstance.generateContent(userText);
  const response = result.response;
  return response.text();
}

// ---------- ENDPOINT ÚNICO
app.post('/api/explain', async (req, res) => {
  try {
    const { model, prompt, context } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Falta 'prompt'." });
    const md = await generateMarkdown({ model, prompt, context });
    res.json({ text: md });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generando explicación', details: String(err?.message || err) });
  }
});

// ---------- INICIO
app.listen(PORT, () => {
  console.log(`API lista en http://localhost:${PORT}`);
  console.log(`Sirviendo /public en http://localhost:${PORT}/`);
});
