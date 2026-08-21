import { writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const enPath = resolve(root, "../messages/en.json");
const outPath = resolve(root, "../src/messages.generated.ts");

const en = JSON.parse(readFileSync(enPath, "utf-8")) as Record<string, unknown>;

function flatten(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return typeof v === "object" && v !== null && !Array.isArray(v)
      ? flatten(v as Record<string, unknown>, key)
      : [key];
  });
}

// Build nested TypeScript interface body string for IntlMessages augmentation.
function buildInterfaceBody(obj: Record<string, unknown>, indent = "    "): string {
  return Object.entries(obj)
    .map(([k, v]) => {
      if (typeof v === "object" && v !== null && !Array.isArray(v)) {
        const nested = buildInterfaceBody(v as Record<string, unknown>, indent + "  ");
        return `${indent}${k}: { ${nested} }`;
      }
      return `${indent}${k}: string`;
    })
    .join("; ");
}

const keys = flatten(en);
const union = keys.map((k) => `  | '${k}'`).join("\n");
const interfaceBody = buildInterfaceBody(en);

const output = `// AUTO-GENERATED — do not edit. Run bun run generate:types to regenerate.

// use-intl IntlMessages augmentation — enables native useTranslations typing.
declare module "use-intl" {
  interface IntlMessages {
${interfaceBody}
  }
}

export type MessageKey =
${union}

export type MessageNamespace = MessageKey extends \`\${infer N}.\${string}\` ? N : never
`;

writeFileSync(outPath, output);
console.log(`Generated ${keys.length} message keys → ${outPath}`);
