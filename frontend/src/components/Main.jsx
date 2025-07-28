import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/antd.min.css";
import "./index.css";

import AOS from "aos";
import "aos/dist/aos.css";

// Custom wrapper 
const RootWithAOS = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return <App />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootWithAOS />
  </React.StrictMode>
);
