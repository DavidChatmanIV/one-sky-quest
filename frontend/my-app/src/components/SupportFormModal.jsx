import React, { useEffect } from "react";
import { Modal, Form, Input, Upload, Button, Typography, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function SupportFormModal({
  open,
  onClose,
  onSubmit,
  defaults = {},
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    const { name = "", email = "", subject = "" } = defaults || {};
    form.resetFields();
    form.setFieldsValue({ name, email, subject, details: "", files: [] });
  }, [open, form, defaults?.name, defaults?.email, defaults?.subject]);

  const handleFinish = async (values) => {
    const payload = {
      name: values.name,
      email: values.email,
      subject: values.subject,
      details: values.details,
      files: (values.files || []).map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        uid: f.uid,
      })),
      createdAt: new Date().toISOString(),
      source: "booking",
    };

    try {
      if (onSubmit) await onSubmit(payload);
      else console.log("[SupportFormModal] submit", payload);
      message.success("Thanks! We received your request.");
      onClose?.();
      form.resetFields();
    } catch (e) {
      console.error(e);
      message.error("Could not send your request. Please try again.");
    }
  };

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList || []);

  return (
    <Modal
      title="Contact Support"
      open={open}
      onCancel={onClose}
      okText="Send"
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Text type="secondary">
        Tell us what you need help with. We usually reply within a few hours.
      </Text>

      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 12 }}
        onFinish={handleFinish}
        requiredMark={false}
      >
        <Form.Item name="name" label="Name">
          <Input placeholder="Your name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email", message: "Enter a valid email" }]}
        >
          <Input placeholder="name@example.com" />
        </Form.Item>

        <Form.Item name="subject" label="Subject">
          <Input placeholder="e.g., Change dates / seat / cancel booking" />
        </Form.Item>

        <Form.Item
          name="details"
          label="Details"
          rules={[{ required: true, message: "Please describe the issue" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Explain what you need help with…"
          />
        </Form.Item>

        <Form.Item
          name="files"
          label="Attachments"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload.Dragger
            multiple
            beforeUpload={() => false}
            accept="image/*,application/pdf"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Screenshots or PDFs help us resolve faster.
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Send
        </Button>
      </Form>
    </Modal>
  );
}
