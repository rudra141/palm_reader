// Lists Groq models available to your API key. Run with:
//   node --env-file=.env.local scripts/list-groq-models.mjs

const key = process.env.GROQ_API_KEY;
if (!key) {
  console.error('GROQ_API_KEY not set');
  process.exit(1);
}

const res = await fetch('https://api.groq.com/openai/v1/models', {
  headers: { authorization: `Bearer ${key}` },
});
if (!res.ok) {
  console.error('list failed:', res.status, await res.text());
  process.exit(1);
}
const data = await res.json();
const models = (data.data ?? []).filter((m) => m.active !== false);
for (const m of models) {
  console.log(`${(m.id || m.name).padEnd(60)}  ctx=${m.context_window ?? '?'}`);
}
