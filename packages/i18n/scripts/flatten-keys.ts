export function flattenKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      return flattenKeys(value as Record<string, unknown>, fullKey);
    }
    return [fullKey];
  });
}

// CLI runner — only executes when run directly: bun scripts/flatten-keys.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  const en = ((await import("../messages/en.json")) as { default: Record<string, unknown> })
    .default;
  const es = ((await import("../messages/es.json")) as { default: Record<string, unknown> })
    .default;
  const enKeys = new Set(flattenKeys(en));
  const esKeys = new Set(flattenKeys(es));
  const missingInEs = [...enKeys].filter((k) => !esKeys.has(k));
  const missingInEn = [...esKeys].filter((k) => !enKeys.has(k));
  if (missingInEs.length)
    console.log("Missing in es.json:\n" + missingInEs.map((k) => `  ${k}`).join("\n"));
  if (missingInEn.length)
    console.log(
      "Extra in es.json (not in en.json):\n" + missingInEn.map((k) => `  ${k}`).join("\n"),
    );
  if (!missingInEs.length && !missingInEn.length)
    console.log("✓ en.json and es.json are in parity");
}
