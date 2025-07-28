import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";

const TutorialModal = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("osq_tutorial_seen");
    if (!seen) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("osq_tutorial_seen", "true");
    setVisible(false);
  };

  return (
    <Modal
      title="👋 Welcome to One Sky Quest!"
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="get-started" type="primary" onClick={handleClose}>
          Let’s Go!
        </Button>,
      ]}
    >
      <p>🌍 Welcome to your travel adventure hub!</p>
      <ul className="list-disc pl-5 mt-3 space-y-1">
        <li>Use the homepage to search flights, hotels, and excursions.</li>
        <li>Track your XP and badges as you explore new places.</li>
        <li>Save trips, chat with others, and share your journey.</li>
        <li>Replay this tutorial anytime from the 🔁 button in the top bar.</li>
      </ul>
    </Modal>
  );
};

export default TutorialModal;
