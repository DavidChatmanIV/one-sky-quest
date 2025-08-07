import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import App from "./App";

// Optional: Theme customization or config can go here later

const Root = () => {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default Root;
