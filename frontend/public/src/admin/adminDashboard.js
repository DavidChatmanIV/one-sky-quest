import React from "react";
import { Layout, Menu, Table } from "antd";

const { Header, Content, Sider } = Layout;

export default function AdminDashboard() {
const columns = [
    { title: "Destination", dataIndex: "destination", key: "destination" },
    { title: "Country", dataIndex: "country", key: "country" },
    { title: "Status", dataIndex: "status", key: "status" },
];

const data = [
    { key: "1", destination: "Rome", country: "Italy", status: "Booked" },
    { key: "2", destination: "Kyoto", country: "Japan", status: "Pending" },
];

return (
    <Layout style={{ minHeight: "100vh" }}>
    <Sider>
        <Menu
        theme="dark"
        mode="inline"
        items={[
            { key: "1", label: "Dashboard" },
            { key: "2", label: "Trips" },
            { key: "3", label: "Users" },
        ]}
        />
    </Sider>
    <Layout>
        <Header style={{ background: "#fff", padding: 16 }}>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </Header>
        <Content style={{ margin: "16px" }}>
        <Table columns={columns} dataSource={data} />
        </Content>
    </Layout>
    </Layout>
);
}
