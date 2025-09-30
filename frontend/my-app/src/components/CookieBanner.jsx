import React, { useState, useEffect } from "react";
import { Button, Alert } from "antd";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieConsent");
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  return (
    visible && (
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <Alert
          message="🍪 We use cookies to enhance your experience."
          description="By continuing to use One Sky Quest, you agree to our use of cookies for things like saving trips and showing travel XP."
          type="info"
          action={
            <Button size="small" type="primary" onClick={handleAccept}>
              Got it!
            </Button>
          }
          showIcon
        />
      </div>
    )
  );
};

export default CookieBanner;
