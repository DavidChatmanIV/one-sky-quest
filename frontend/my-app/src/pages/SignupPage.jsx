import React from "react";
import { Card } from "antd";
import SignupForm from "../components/auth/SignupForm";

const SignupPage = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <Card title="Create Your Account" style={{ width: 400 }}>
        <SignupForm />
      </Card>
    </div>
  );
};

export default SignupPage;
