import React, { useState } from "react";
import { Input, Button, message, Card } from "antd";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      message.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <div className="flex justify-center p-8">
      <Card title="Log In" style={{ width: 400 }}>
        <Input
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{ marginBottom: 12 }}
        />
        <Input.Password
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" block onClick={handleLogin}>
          🔐 Login
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
