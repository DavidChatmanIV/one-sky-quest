import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const STORAGE_KEY = "osq_assistant";
const AssistantCtx = createContext({
  // modern, normalized value
  assistant: "sora",
  // legacy alias (Title Case) if any component still reads it
  selectedAssistant: "Sora",
  // setter
  setAssistant: () => {},
});

function normalizeIn(name) {
  // accepts "sora" | "Sora" | "questy" | "Questy"
  const n = String(name || "").toLowerCase();
  return n === "questy" ? "questy" : "sora";
}

function toTitle(n) {
  return n === "questy" ? "Questy" : "Sora";
}

export function AssistantProvider({ children, initial = "sora" }) {
  const [assistant, setAssistantState] = useState(() => {
    if (typeof window === "undefined") return normalizeIn(initial);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return normalizeIn(stored || initial);
    } catch {
      return normalizeIn(initial);
    }
  });

  // persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, assistant);
    } catch {
      /* ignore */
    }
  }, [assistant]);

  const setAssistant = (name) => setAssistantState(normalizeIn(name));

  const value = useMemo(
    () => ({
      assistant, // "sora" | "questy"  ← use this going forward
      selectedAssistant: toTitle(assistant), // legacy alias ("Sora" | "Questy")
      setAssistant, // accepts either case
    }),
    [assistant]
  );

  return (
    <AssistantCtx.Provider value={value}>{children}</AssistantCtx.Provider>
  );
}

export function useAssistant() {
  return useContext(AssistantCtx);
}

export default AssistantCtx;
