import React, { useState, useEffect } from "react";
import { Input, Button, message, Card } from "antd";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  // If already logged in, redirect
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ marginBottom: 12 }}
        />
        <Input.Password
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" block onClick={handleLogin}>
          🔐 Log In
        </Button>
      </Card>
    </div>
  );
};

export default LoginForm;
