import React, { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "antd";

const { Text } = Typography;

const iconMap = {
  success: <CheckCircleOutlined className="text-green-600 mr-2" />,
  error: <CloseCircleOutlined className="text-red-600 mr-2" />,
  info: <InfoCircleOutlined className="text-blue-600 mr-2" />,
};

const ToastNotification = ({
  type = "success",
  message = "",
  visible,
  onClose,
}) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
    if (visible) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-xl p-4 flex items-center space-x-2"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          {iconMap[type]}
          <Text>{message}</Text>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastNotification;
