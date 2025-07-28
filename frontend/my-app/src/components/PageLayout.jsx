import React from "react";
import { Layout } from "antd";
import Navbar from "./Navbar";

const { Content, Footer } = Layout;

const PageLayout = ({ children }) => (
  <Layout className="min-h-screen flex flex-col">
    <Navbar />
    <Content className="flex-1 pt-16 bg-gray-50">{children}</Content>
    {/* Optional: Include your footer here or leave it in the LandingPage */}
    {/* <Footer className="text-center bg-gray-800 text-white py-4">
      &copy; {new Date().getFullYear()} One Sky Quest. All rights reserved.
    </Footer> */}
  </Layout>
);

export default PageLayout;
