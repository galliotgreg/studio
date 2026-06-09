import type { GratitudeEntry } from "./types";

/**
 * Calcule la plus longue série de jours calendaires consécutifs à partir des
 * entrées. `state.streak` ne stocke que la série courante (remise à 0 dès un
 * jour manqué) — pour le récap J30 on veut le meilleur run de tout le parcours.
 *
 * Déterministe, sans dépendance au fuseau au-delà de `toDateString()` (jour
 * local). Doublons du même jour comptés une seule fois.
 */
export function computeLongestStreak(entries: GratitudeEntry[]): number {
  if (!entries || entries.length === 0) return 0;

  // Jours uniques, normalisés à minuit local, triés croissant.
  const days = Array.from(
    new Set(
      entries
        .map((e) => new Date(e.date))
        .filter((d) => !Number.isNaN(d.getTime()))
        .map((d) => new Date(d.toDateString()).getTime())
    )
  ).sort((a, b) => a - b);

  if (days.length === 0) return 0;

  const ONE_DAY = 86400000;
  let longest = 1;
  let current = 1;

  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((days[i] - days[i - 1]) / ONE_DAY);
    if (diff === 1) {
      current += 1;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }

  return longest;
}
