import { describe, it, expect } from "vitest";
import { computeLongestStreak } from "@/lib/streak";
import type { GratitudeEntry } from "@/lib/types";

function entry(date: string): GratitudeEntry {
  return { day: 1, date, text: "x", prompt: "p" };
}

describe("computeLongestStreak", () => {
  it("renvoie 0 pour aucune entrée", () => {
    expect(computeLongestStreak([])).toBe(0);
  });

  it("renvoie 1 pour une seule entrée", () => {
    expect(computeLongestStreak([entry("2026-06-01T10:00:00Z")])).toBe(1);
  });

  it("compte une série de jours consécutifs", () => {
    const e = [
      entry("2026-06-01T10:00:00Z"),
      entry("2026-06-02T10:00:00Z"),
      entry("2026-06-03T10:00:00Z"),
    ];
    expect(computeLongestStreak(e)).toBe(3);
  });

  it("garde le meilleur run quand il y a un trou", () => {
    const e = [
      entry("2026-06-01T10:00:00Z"),
      entry("2026-06-02T10:00:00Z"),
      // trou le 3
      entry("2026-06-04T10:00:00Z"),
      entry("2026-06-05T10:00:00Z"),
      entry("2026-06-06T10:00:00Z"),
    ];
    expect(computeLongestStreak(e)).toBe(3);
  });

  it("dédoublonne plusieurs entrées le même jour", () => {
    const e = [
      entry("2026-06-01T08:00:00Z"),
      entry("2026-06-01T20:00:00Z"),
      entry("2026-06-02T09:00:00Z"),
    ];
    expect(computeLongestStreak(e)).toBe(2);
  });

  it("est insensible à l'ordre des entrées", () => {
    const e = [
      entry("2026-06-03T10:00:00Z"),
      entry("2026-06-01T10:00:00Z"),
      entry("2026-06-02T10:00:00Z"),
    ];
    expect(computeLongestStreak(e)).toBe(3);
  });
});
