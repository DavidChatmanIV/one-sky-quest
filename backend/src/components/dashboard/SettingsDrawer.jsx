import React, { useEffect, useState } from "react";
import { Drawer, Switch, Radio, Button, message, Modal, Select } from "antd";

const { Option } = Select;

const SettingsDrawer = ({ visible, onClose }) => {
  const [layout, setLayout] = useState("card");
  const [showFeed, setShowFeed] = useState(true);
  const [showTrips, setShowTrips] = useState(true);
  const [confirmResetVisible, setConfirmResetVisible] = useState(false);
  const [avatar, setAvatar] = useState("default1");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("osq_dashboard_settings"));
    if (saved) {
      setLayout(saved.layoutType);
      setShowFeed(saved.showFeed);
      setShowTrips(saved.showTrips);
      setAvatar(saved.avatar || "default1");
    }
  }, []);

  const saveSettings = () => {
    const newSettings = {
      layoutType: layout,
      showFeed,
      showTrips,
      avatar,
    };
    localStorage.setItem("osq_dashboard_settings", JSON.stringify(newSettings));
    message.success("Preferences saved!");
    onClose();
  };

  const handleReset = () => {
    setConfirmResetVisible(true);
  };

  const confirmReset = () => {
    localStorage.removeItem("osq_dashboard_settings");
    setLayout("card");
    setShowFeed(true);
    setShowTrips(true);
    setAvatar("default1");
    setConfirmResetVisible(false);
    message.info("Preferences reset to default.");
  };

  return (
    <>
      <Drawer
        title="🛠 Customize Layout"
        placement="right"
        onClose={onClose}
        open={visible}
        width={300}
      >
        <div className="space-y-6">
          <div>
            <p className="font-medium mb-2">Layout Type</p>
            <Radio.Group
              onChange={(e) => setLayout(e.target.value)}
              value={layout}
            >
              <Radio value="card">Card</Radio>
              <Radio value="grid">Grid</Radio>
            </Radio.Group>
          </div>

          <div>
            <p className="font-medium mb-2">Show Sections</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Quest Feed</span>
                <Switch checked={showFeed} onChange={setShowFeed} />
              </div>
              <div className="flex justify-between">
                <span>Saved Trips</span>
                <Switch checked={showTrips} onChange={setShowTrips} />
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Default Avatar</p>
            <Select
              value={avatar}
              onChange={(val) => setAvatar(val)}
              className="w-full"
            >
              <Option value="default1">🌍 Globe</Option>
              <Option value="default2">✈️ Airplane</Option>
              <Option value="default3">🏝 Island</Option>
              <Option value="default4">🧳 Luggage</Option>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Button type="primary" block onClick={saveSettings}>
              Save Changes
            </Button>
            <Button danger type="default" block onClick={handleReset}>
              Reset to Default
            </Button>
          </div>
        </div>
      </Drawer>

      <Modal
        title="Reset Preferences"
        open={confirmResetVisible}
        onOk={confirmReset}
        onCancel={() => setConfirmResetVisible(false)}
        okText="Yes, Reset"
        cancelText="Cancel"
      >
        <p>This will reset all layout settings to default. Continue?</p>
      </Modal>
    </>
  );
};

export default SettingsDrawer;
