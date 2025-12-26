// import { neon, neonConfig } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
// import ws from "ws";

// import {
//   interaction,
//   hiringProcess,
//   companyDetails,
//   account,
//   user,
//   session,
// } from "./schema";

// neonConfig.webSocketConstructor = ws;

// const schemas = {
//   user,
//   account,
//   session,
//   hiringProcess,
//   companyDetails,
//   interaction,
// };

// // To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// // neonConfig.poolQueryViaFetch = true
// const sql = neon(process.env.DATABASE_URL || "");
// export const db = drizzle(sql, { schema: schemas });

// // Re-export schema types
// export * from "./schema";
