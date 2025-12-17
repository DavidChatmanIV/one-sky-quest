import React from "react";
import { Tabs } from "antd";

const tabItems = [
  {
    key: "1",
    label: "Tab 1",
    children: <p>Content of Tab 1</p>,
  },
  {
    key: "2",
    label: "Tab 2",
    children: <p>Content of Tab 2</p>,
  },
];

const MyTabs = () => {
  return <Tabs defaultActiveKey="1" items={tabItems} />;
};

export default MyTabs;
