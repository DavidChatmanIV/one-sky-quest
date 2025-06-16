import React from "react";
import { Tooltip } from "antd";
import { StarFilled } from "@ant-design/icons";

// Tooltip text for each badge type
const badgeDescriptions = {
  user: "This user is face or follower verified",
  business: "Official business account",
  admin: "Staff/Admin verified by platform",
  leader: "Trusted community leader",
};

// Badge component shapes with animation & color theme
const VerifiedBadge = ({ type = "user" }) => {
  const badgeShapes = {
    user: (
      <span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-500 text-white animate-pulse">
        ✔ Verified
      </span>
    ),
    business: (
      <span className="rounded px-2 py-0.5 text-xs font-semibold bg-amber-500 text-white">
        💼 Business
      </span>
    ),
    admin: (
      <span className="clip-hex px-2 py-0.5 text-xs font-semibold bg-rose-500 text-white animate-bounce">
        🛡️ Staff
      </span>
    ),
    leader: (
      <span className="rounded-full flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-teal-500 text-white animate-wiggle">
        <StarFilled /> Leader
    </span>
    ),
  };

  return (
    <Tooltip title={badgeDescriptions[type]}>
      <div className="inline-block">{badgeShapes[type]}</div>
    </Tooltip>
  );
};

export default VerifiedBadge;
