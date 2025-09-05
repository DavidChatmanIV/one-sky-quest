// src/context/AssistantProvider.jsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const STORAGE_KEY = "osq_assistant";

// Normalize the assistant name
const normalizeIn = (name) =>
  String(name || "").toLowerCase() === "questy" ? "questy" : "sora";

const toTitle = (n) => (n === "questy" ? "Questy" : "Sora");

// Create context
const AssistantCtx = createContext(null);

export function AssistantProvider({ children, initial = "sora" }) {
  const [assistant, setAssistantState] = useState(() => {
    if (typeof window === "undefined") return normalizeIn(initial);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return normalizeIn(stored || initial);
    } catch {
      return normalizeIn(initial);
    }
  });

  // Save to localStorage when assistant changes
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, assistant);
    } catch {
      // ignore storage errors
    }
  }, [assistant]);

  const setAssistant = (name) => setAssistantState(normalizeIn(name));

  const value = useMemo(
    () => ({
      assistant, // raw value: "sora" | "questy"
      selectedAssistant: toTitle(assistant), // "Sora" | "Questy"
      setAssistant, // setter function
    }),
    [assistant]
  );

  return (
    <AssistantCtx.Provider value={value}>{children}</AssistantCtx.Provider>
  );
}

export function useAssistant() {
  const ctx = useContext(AssistantCtx);
  if (!ctx) {
    throw new Error("useAssistant must be used inside <AssistantProvider>");
  }
  return ctx;
}
