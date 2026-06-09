// AN-3 — Pont "le défi" -> Newsletter (Ghost).
// Utilise l'API membres native de Ghost (flux Portal), double opt-in :
// Ghost envoie un e-mail de confirmation, l'abonné·e est créé·e après clic.
// Aucun secret exposé : ce sont les endpoints publics utilisés par le Portal.

const GHOST_URL = (
  process.env.NEXT_PUBLIC_GHOST_URL || "https://www.greg-ggt.com"
).replace(/\/$/, "");

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "network" | "server" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

// Ghost 5.x protège send-magic-link par un "integrity token".
// On le récupère en best-effort ; s'il n'existe pas (Ghost plus ancien),
// on poursuit sans, l'endpoint l'ignore.
async function getIntegrityToken(): Promise<string | undefined> {
  try {
    const res = await fetch(`${GHOST_URL}/members/api/integrity-token/`, {
      method: "GET",
      headers: { "app-pragma": "no-cache" },
    });
    if (!res.ok) return undefined;
    const token = (await res.text()).trim();
    return token || undefined;
  } catch {
    return undefined;
  }
}

export async function subscribeToNewsletter(
  rawEmail: string,
  // Attribution best-effort : labels posés sur le membre Ghost. Par défaut
  // ["défi"] (capture mi-parcours) ; l'écran J30 passe ["défi", "defi-j30"]
  // pour distinguer les inscrits du pic de complétion dans Ghost Admin.
  labels: string[] = ["défi"]
): Promise<SubscribeResult> {
  const email = rawEmail.trim();
  if (!isValidEmail(email)) return { ok: false, reason: "invalid" };

  const integrityToken = await getIntegrityToken();

  const body: Record<string, unknown> = {
    email,
    emailType: "subscribe",
    // Ghost peut ignorer ce champ sur l'endpoint public (vérifié OK le 9/6/2026
    // sur une inscription test : le label remonte bien) ; aucun effet négatif.
    labels,
    name: null,
  };
  if (integrityToken) body.integrityToken = integrityToken;

  try {
    const res = await fetch(`${GHOST_URL}/members/api/send-magic-link/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    return { ok: false, reason: "server" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
