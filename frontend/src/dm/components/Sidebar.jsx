import React from "react";
import { List } from "antd";

const mockConversations = [
  { id: 1, name: "Ava from Tokyo" },
  { id: 2, name: "Luca from Italy" },
  { id: 3, name: "Sophie from Greece" },
];

const Sidebar = ({ onSelect }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={mockConversations}
      renderItem={(item) => (
        <List.Item onClick={() => onSelect(item)} style={{ cursor: "pointer" }}>
          <List.Item.Meta title={item.name} />
        </List.Item>
      )}
    />
  );
};

export default Sidebar;
