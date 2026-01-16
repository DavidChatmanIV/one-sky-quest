import React from "react";
import { requireAuthOrOpenModal } from "../../auth/requireAuth";
import { useAuth } from "../../auth/useAuth";
import { useAuthModal } from "../../auth/AuthModalController";

export default function SaveTripButton() {
  const auth = useAuth();
  const { openAuth } = useAuthModal();

  function onSave() {
    const ok = requireAuthOrOpenModal({
      auth,
      openAuth,
      intent: "save",
      redirectTo: "/booking",
    });
    if (!ok) return;

    // ✅ do save
  }

  return <button onClick={onSave}>Save Trip</button>;
}