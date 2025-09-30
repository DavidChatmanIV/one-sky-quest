import { createContext } from "react";

export const STORAGE_KEY = "osq_assistant";
export const normalize = (v) =>
  String(v).toLowerCase() === "questy" ? "Questy" : "Sora";

const isDev =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.MODE !== "production";

const hasWindow = () => typeof window !== "undefined";
export const hasDoc = () => typeof document !== "undefined";
const hasStorage = () => hasWindow() && !!window.localStorage;

export const safeGet = (k) => {
  if (!hasStorage()) return null;
  try {
    return window.localStorage.getItem(k);
  } catch (e) {
    if (isDev) console.debug("[Assistant] get failed", e);
    return null;
  }
};
export const safeSet = (k, v) => {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(k, v);
  } catch (e) {
    if (isDev) console.debug("[Assistant] set failed", e);
  }
};
export const safeRemove = (k) => {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(k);
  } catch (e) {
    if (isDev) console.debug("[Assistant] remove failed", e);
  }
};

export const AssistantContext = createContext({
  assistant: "Sora",
  setAssistant: () => {},
  isSora: true,
  isQuesty: false,
  options: ["Sora", "Questy"],
});
