import { message } from "antd";

export const showXpToast = (amount = 10, label = "") => {
  message.success({
    content: `⭐ +${amount} XP ${label ? `for ${label}` : ""}!`,
    duration: 3,
    style: {
      fontSize: "1rem",
    },
  });
};
