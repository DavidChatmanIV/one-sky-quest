import React from "react";
import { Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

export default function BookMenu() {
  const { pathname } = useLocation();
  const isBooking = pathname.startsWith("/booking");

  const items = [
    { key: "stays", label: <Link to="/booking?tab=stays">Stays</Link> },
    { key: "flights", label: <Link to="/booking?tab=flights">Flights</Link> },
    { key: "cars", label: <Link to="/booking?tab=cars">Cars</Link> },
    { key: "cruises", label: <Link to="/booking?tab=cruises">Cruises</Link> },
    {
      key: "packages",
      label: <Link to="/booking?tab=packages">Packages</Link>,
    },
    {
      key: "excursions",
      label: <Link to="/booking?tab=excursions">Excursions</Link>,
    },
    {
      key: "last-minute",
      label: <Link to="/booking?tab=last-minute">Last-Minute</Link>,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomLeft" trigger={["click"]}>
      <button className={`nav-link ${isBooking ? "active" : ""}`} type="button">
        Book <DownOutlined className="chev" />
      </button>
    </Dropdown>
  );
}
