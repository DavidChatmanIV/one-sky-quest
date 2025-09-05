import React from "react";
import Icon from "@ant-design/icons";

// SVG for a simple "plane departure" icon
const PlaneDepartureSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 640 512">
    <path
      d="M624 448H16c-8.8 0-16 7.2-16 16v16c0 
      8.8 7.2 16 16 16h608c8.8 0 16-7.2 
      16-16v-16c0-8.8-7.2-16-16-16zM272 
      224L118.2 72.6c-6.5-6.2-16.7-6-22.9.4L68.3 
      100c-6.3 6.3-6.2 16.5.2 22.8l130 
      125.3-122.5 65.3c-13.9 7.4-20.3 
      24.4-14.2 39.1l10.6 25.9c6.6 
      16 25.2 23.6 41.2 17.1l160.9-64.8 
      95.6 92.2c13.2 12.7 34.2 
      12.1 46.9-1.1l30.3-31.6c12.7-13.2 
      12.1-34.2-1.1-46.9l-95.6-92.2 
      64.8-160.9c6.5-16-1.1-34.6-17.1-41.2l-25.9-10.6c-14.7-6.1-31.7.3-39.1 
      14.2L272 224z"
    />
  </svg>
);

const PlaneDepartureOutlined = (props) => (
  <Icon component={PlaneDepartureSvg} {...props} />
);

export default PlaneDepartureOutlined;
