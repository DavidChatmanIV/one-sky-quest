import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; //  Capitalized to match file name
import "antd/dist/reset.css"; //  Ant Design v5 reset
import "./index.css"; // Tailwind CSS styles

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
