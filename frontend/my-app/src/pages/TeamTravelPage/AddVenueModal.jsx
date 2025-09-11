import { Button, Form, Input, Modal, Space } from "antd";
import CTAButton from "../../components/CTAButton";

export default function AddVenueModal({
  open,
  initialAddress,
  onCancel,
  onSubmit,
}) {
  const [form] = Form.useForm();
  return (
    <Modal
      title="Add Custom Venue"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ name: "", address: initialAddress }}
      >
        <Form.Item
          name="name"
          label="Venue Name"
          rules={[{ required: true, message: "Enter venue name" }]}
        >
          <Input placeholder="e.g., Johnson Family Field" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Venue Address"
          rules={[{ required: true, message: "Enter full address" }]}
        >
          <Input placeholder="123 Main St, City, State" />
        </Form.Item>
        <Space style={{ justifyContent: "flex-end", width: "100%" }}>
          <Button onClick={onCancel}>Cancel</Button>
          <CTAButton htmlType="submit">Add</CTAButton>
        </Space>
      </Form>
    </Modal>
  );
}
