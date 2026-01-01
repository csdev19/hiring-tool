import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";

import * as schema from "./schemas";

neonConfig.webSocketConstructor = ws;

console.log("process.env", process.env);
// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true
// const sql = neon(process.env.DATABASE_URL || "");
// export const db = drizzle(sql, { schema });

export const createDatabaseClient = (databaseUrl: string) => {
  console.log("databaseUrl", databaseUrl);
  const sql = neon(databaseUrl);
  console.log("sql", sql);
  return drizzle(sql, { schema });
};
