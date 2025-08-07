import React, { createContext, useContext, useEffect, useState } from "react";

const AssistantContext = createContext({
  assistant: "sora",
  setAssistant: () => {},
});

export const AssistantProvider = ({ children }) => {
  const [assistant, setAssistant] = useState("sora");

  // Load on mount
  useEffect(() => {
    const saved = localStorage.getItem("assistant");
    if (saved) setAssistant(saved);
  }, []);

  // Persist on change
  useEffect(() => {
    localStorage.setItem("assistant", assistant);
    document.documentElement.dataset.assistant = assistant; // optional: CSS theme hooks
  }, [assistant]);

  return (
    <AssistantContext.Provider value={{ assistant, setAssistant }}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => useContext(AssistantContext);
