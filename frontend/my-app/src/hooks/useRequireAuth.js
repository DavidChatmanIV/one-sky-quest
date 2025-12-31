import { useState } from "react";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../auth/AuthProvider";

export function useRequireAuth(defaultIntent = "continue") {
  const { isAuthed } = useAuth();
  const [intent, setIntent] = useState(defaultIntent);
  const [open, setOpen] = useState(false);

  function requireAuth(nextIntent = defaultIntent) {
    if (isAuthed) return true;
    setIntent(nextIntent);
    setOpen(true);
    return false;
  }

  const modal = (
    <AuthModal open={open} onClose={() => setOpen(false)} intent={intent} />
  );

  return { requireAuth, modal };
}