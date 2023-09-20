import { Pool } from "pg";
const connectionString = `postgresql://
${process.env.DB_USER}:
${process.env.DB_PASSWORD}@
${process.env.DB_HOST}:
${process.env.DB_PORT}/
${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default async function sql({ query }: { query: string }) {
  const client = await pool.connect();
  const res = await client.query(query);
  client.release();
  return res;
}
