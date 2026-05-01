// Lists Gemini models available to your API key. Run with:
//   node --env-file=.env.local scripts/list-gemini-models.mjs

const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!key) {
  console.error('GOOGLE_GENERATIVE_AI_API_KEY not set');
  process.exit(1);
}

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
if (!res.ok) {
  console.error('list failed:', res.status, await res.text());
  process.exit(1);
}
const data = await res.json();
const models = (data.models ?? [])
  .filter((m) => (m.supportedGenerationMethods ?? []).includes('generateContent'))
  .map((m) => ({
    name: m.name.replace(/^models\//, ''),
    in: m.inputTokenLimit,
    out: m.outputTokenLimit,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

for (const m of models) {
  console.log(`${m.name.padEnd(50)}  in=${m.in}  out=${m.out}`);
}
