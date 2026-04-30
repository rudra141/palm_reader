import postgres from 'postgres';

const url = process.env.DATABASE_URL;
const client = postgres(url, { max: 1, prepare: false });
const rows = await client`
  select table_name from information_schema.tables
  where table_schema = 'public' order by table_name
`;
console.log(rows.map((r) => r.table_name).join(', '));
await client.end();
