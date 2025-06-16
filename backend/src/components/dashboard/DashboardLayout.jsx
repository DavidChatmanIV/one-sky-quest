import React, { useState } from "react";
import { Layout, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import SettingsDrawer from "./SettingsDrawer";
import DashboardContent from "./DashboardContent";

const { Header, Content, Footer } = Layout;

const DashboardLayout = () => {
const [drawerVisible, setDrawerVisible] = useState(false);

const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
};

return (
    <Layout className="min-h-screen">
    <Header className="bg-blue-600 text-white flex justify-between items-center px-6">
        <h1 className="text-xl font-bold">🌍 One Sky Quest Dashboard</h1>
        <Button
        type="primary"
        icon={<SettingOutlined />}
        onClick={toggleDrawer}
        >
        Customize
        </Button>
    </Header>

    <Content className="p-6 bg-gray-100 dark:bg-gray-900 transition-all">
        <DashboardContent />
    </Content>

    <Footer className="text-center bg-white dark:bg-gray-800 py-4">
        © 2026 One Sky Quest. All rights reserved.
    </Footer>

    <SettingsDrawer visible={drawerVisible} onClose={toggleDrawer} />
    </Layout>
);
};

export default DashboardLayout;
