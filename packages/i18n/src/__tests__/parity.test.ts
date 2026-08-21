import { describe, it, expect } from "vitest";
import { flattenKeys } from "../../scripts/flatten-keys";
import en from "../../messages/en.json";
import es from "../../messages/es.json";

describe("flattenKeys", () => {
  it("returns top-level keys of a flat object", () => {
    expect(flattenKeys({ a: "1", b: "2" })).toEqual(["a", "b"]);
  });

  it("flattens one level of nesting to dot-notation", () => {
    expect(flattenKeys({ a: { b: "1", c: "2" } })).toEqual(["a.b", "a.c"]);
  });

  it("flattens deeply nested objects", () => {
    expect(flattenKeys({ a: { b: { c: "1" } } })).toEqual(["a.b.c"]);
  });

  it("handles mixed flat and nested at the same level", () => {
    const keys = flattenKeys({ top: "1", nested: { child: "2" } });
    expect(keys).toContain("top");
    expect(keys).toContain("nested.child");
    expect(keys).toHaveLength(2);
  });
});

describe("i18n key parity — en.json ↔ es.json", () => {
  const enKeys = new Set(flattenKeys(en as Record<string, unknown>));
  const esKeys = new Set(flattenKeys(es as Record<string, unknown>));

  it("es.json has every key from en.json", () => {
    const missing = [...enKeys].filter((k) => !esKeys.has(k));
    expect(missing, `Keys in en.json missing from es.json:\n${missing.join("\n")}`).toHaveLength(0);
  });

  it("en.json has every key from es.json (no extra keys in es)", () => {
    const extra = [...esKeys].filter((k) => !enKeys.has(k));
    expect(extra, `Keys in es.json not in en.json:\n${extra.join("\n")}`).toHaveLength(0);
  });

  it("no empty-string values in en.json", () => {
    const empty = [...enKeys].filter((k) => {
      const val = k.split(".").reduce((o: unknown, p) => (o as Record<string, unknown>)[p], en);
      return val === "";
    });
    expect(empty, `Empty values in en.json:\n${empty.join("\n")}`).toHaveLength(0);
  });

  it("no empty-string values in es.json", () => {
    const empty = [...esKeys].filter((k) => {
      const val = k.split(".").reduce((o: unknown, p) => (o as Record<string, unknown>)[p], es);
      return val === "";
    });
    expect(empty, `Empty values in es.json:\n${empty.join("\n")}`).toHaveLength(0);
  });
});
