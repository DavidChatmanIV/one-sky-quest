// ✅ Use this anywhere you need guest gating with a premium modal
export function requireAuthOrOpenModal({
  auth,
  openAuth,
  intent = "save", // "dm" | "post" | "save" | "book"
  redirectTo = "/passport",
}) {
  if (auth?.isAuthed) return true;

  // Guests + logged-out users both get the same calm premium gating
  openAuth?.({
    intent,
    redirectTo,
    title: "Create your boarding pass to continue",
    body: "You’re in Preview Mode. Sign in or create an account to unlock this feature.",
  });

  return false;
}