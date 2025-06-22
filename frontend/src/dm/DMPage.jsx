import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

const { Sider, Content } = Layout;

const DMPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        width={250}
        style={{ background: "#fff", borderRight: "1px solid #eee" }}
      >
        <Sidebar onSelect={setSelectedConversation} />
      </Sider>
      <Content>
        <ChatWindow conversation={selectedConversation} />
      </Content>
    </Layout>
  );
};

export default DMPage;
