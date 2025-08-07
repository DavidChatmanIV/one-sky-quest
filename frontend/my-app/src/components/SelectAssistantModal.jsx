import React from "react";
import { Modal, Card, Button, Tag, Typography, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const SelectAssistantModal = ({ visible, onSelect, onCancel }) => {
  return (
    <Modal
      title="🧭 Who’s guiding your next adventure?"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <Row gutter={16} justify="center">
        <Col span={12}>
          <Card
            hoverable
            bordered
            onClick={() => onSelect("sora")}
            style={{ textAlign: "center" }}
          >
            <Title level={4}>☁️ Sora</Title>
            <Tag color="blue">Chill & Helpful</Tag>
            <Paragraph>
              Smooth, stress-free planning with real insights. Sora’s here to
              keep it calm.
            </Paragraph>
            <Button type="primary" block>
              Select Sora
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            bordered
            onClick={() => onSelect("questy")}
            style={{ textAlign: "center" }}
          >
            <Title level={4}>⚡ Questy</Title>
            <Tag color="volcano">Fun & Fast-Paced</Tag>
            <Paragraph>
              Turn trip planning into an XP quest. Budget targets, travel
              challenges, and badges await!
            </Paragraph>
            <Button type="primary" block>
              Select Questy
            </Button>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default SelectAssistantModal;
