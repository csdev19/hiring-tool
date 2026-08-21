import { describe, it, expect } from "vitest";
import { isLocale, AVAILABLE_LOCALES, DEFAULT_LOCALE, COOKIE_KEY, loadMessages } from "../config";

describe("isLocale", () => {
  it("returns true for valid locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("es")).toBe(true);
  });

  it("returns false for invalid values", () => {
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(42)).toBe(false);
  });

  it("is case-sensitive", () => {
    expect(isLocale("EN")).toBe(false);
    expect(isLocale("Es")).toBe(false);
  });
});

describe("constants", () => {
  it("DEFAULT_LOCALE is en", () => {
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("COOKIE_KEY matches hiring-tool:locale", () => {
    expect(COOKIE_KEY).toBe("hiring-tool:locale");
  });

  it("AVAILABLE_LOCALES contains en and es", () => {
    expect(AVAILABLE_LOCALES).toContain("en");
    expect(AVAILABLE_LOCALES).toContain("es");
    expect(AVAILABLE_LOCALES).toHaveLength(2);
  });
});

describe("loadMessages", () => {
  it("returns an object for en", async () => {
    const messages = await loadMessages("en");
    expect(typeof messages).toBe("object");
    expect(messages).not.toBeNull();
  });

  it("returns an object for es", async () => {
    const messages = await loadMessages("es");
    expect(typeof messages).toBe("object");
    expect(messages).not.toBeNull();
  });
});
