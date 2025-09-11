import { Button } from "antd";

/** Primary CTA with OSQ gradient class */
export default function CTAButton({ className = "", ...props }) {
  return (
    <Button
      type="primary"
      className={`osq-gradient-btn ${className}`}
      {...props}
    />
  );
}
