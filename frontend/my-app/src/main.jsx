import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./Root";
import { AssistantProvider } from "./context/AssistantContext"; // ✅ new

// Styles
import "antd/dist/reset.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AssistantProvider>
      <Root />
    </AssistantProvider>
  </React.StrictMode>
);
