import { describe, it, expect } from "vitest";
import { parseAcceptLanguage } from "../web";

describe("parseAcceptLanguage", () => {
  it("returns matching locale for exact match", () => {
    expect(parseAcceptLanguage("es")).toBe("es");
    expect(parseAcceptLanguage("en")).toBe("en");
  });

  it("extracts primary subtag from full locale", () => {
    expect(parseAcceptLanguage("es-419")).toBe("es");
    expect(parseAcceptLanguage("en-US")).toBe("en");
    expect(parseAcceptLanguage("es-PE")).toBe("es");
  });

  it("picks first matching locale from comma-separated list", () => {
    expect(parseAcceptLanguage("es-PE,es;q=0.9,en;q=0.8")).toBe("es");
    expect(parseAcceptLanguage("fr,es;q=0.9,en;q=0.8")).toBe("es");
  });

  it("returns null when no supported locale found", () => {
    expect(parseAcceptLanguage("fr")).toBeNull();
    expect(parseAcceptLanguage("de,fr;q=0.9")).toBeNull();
    expect(parseAcceptLanguage("")).toBeNull();
  });

  it("is case-insensitive for input", () => {
    expect(parseAcceptLanguage("ES")).toBe("es");
    expect(parseAcceptLanguage("EN-US")).toBe("en");
  });
});
