import React, { useState } from "react";
import { Form, Input, Button, message, Card, Upload, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // preview or file for future use

  const onFinish = async (values) => {
    setLoading(true);

    // For now, just send text fields; image handling later
    const { name, location, about } = values;

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, about }),
      });

      if (res.ok) {
        message.success("🎉 Profile saved successfully!");
      } else {
        message.error("❌ Failed to save profile.");
      }
    } catch (err) {
      console.error(err);
      message.error("⚠️ Server error. Try again later.");
    }

    setLoading(false);
  };

  // Handle manual upload preview
  const handleImageChange = (file) => {
    setImage(file);
    return false; // prevent auto-upload
  };

  return (
    <Card
      title="✍️ Create Your Profile"
      className="max-w-xl mx-auto mt-10 shadow-lg dark:bg-gray-800 dark:text-white"
    >
      <Form layout="vertical" onFinish={onFinish}>
        {/* Upload + Avatar */}
        <Form.Item label="Profile Picture" name="avatar">
          <Upload
            listType="picture-circle"
            showUploadList={false}
            beforeUpload={handleImageChange}
          >
            <Avatar
              size={64}
              icon={<UserOutlined />}
              src={image ? URL.createObjectURL(image) : null}
            />
            <div className="mt-2 text-sm text-blue-600">Upload</div>
          </Upload>
        </Form.Item>

        {/* Name */}
        <Form.Item
          label="Display Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input placeholder="Anna Santander" />
        </Form.Item>

        {/* Location */}
        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter your location!" }]}
        >
          <Input placeholder="Santa Fe, NM" />
        </Form.Item>

        {/* About */}
        <Form.Item
          label="About Me"
          name="about"
          rules={[{ required: true, message: "Tell us about yourself!" }]}
        >
          <Input.TextArea rows={4} placeholder="Travel enthusiast & sky kid" />
        </Form.Item>

        {/* Submit */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Profile
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProfileForm;