import React from "react";
import { Progress, Badge } from "antd";

const XPStats = ({ xp, level }) => {
  const nextLevelXP = (level + 1) * 500;
  const percent = Math.min((xp / nextLevelXP) * 100, 100);

  return (
    <div className="mb-6">
      <Badge.Ribbon text={`Level ${level}`} color="blue">
        <Progress percent={percent} status="active" showInfo />
      </Badge.Ribbon>
      <p className="mt-2 text-gray-600">
        XP: {xp} / {nextLevelXP}
      </p>
    </div>
  );
};

export default XPStats;
