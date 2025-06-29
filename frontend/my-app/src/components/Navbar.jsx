import React from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  GiftOutlined,
  CarOutlined,
  RocketOutlined,
  PhoneOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  return (
    <Header className="flex items-center justify-between bg-white px-6 shadow z-50 sticky top-0 w-full">
      {/* Logo and Brand */}
      <div className="flex items-center space-x-3">
        <img
          src="/image/logo.png"
          alt="One Sky Quest Logo"
          className="h-10 w-10 object-contain"
        />
        <span className="text-xl font-bold text-gray-800">
          One <span className="text-blue-600">Sky</span>{" "}
          <span className="text-orange-500">Quest</span>
        </span>
      </div>

      {/* Navigation */}
      <Menu
        mode="horizontal"
        className="flex-1 justify-center font-medium bg-white"
        selectable={false}
      >
        <Menu.Item key="flights" icon={<RocketOutlined />}>
          <Link to="/flights">Flights</Link>
        </Menu.Item>
        <Menu.Item key="hotels" icon={<HomeOutlined />}>
          <Link to="/hotels">Hotels</Link>
        </Menu.Item>
        <Menu.Item key="packages" icon={<GiftOutlined />}>
          <Link to="/packages">Packages</Link>
        </Menu.Item>
        <Menu.Item key="cars" icon={<CarOutlined />}>
          <Link to="/cars">Cars</Link>
        </Menu.Item>
        <Menu.Item key="cruises" icon={<RocketOutlined />}>
          <Link to="/cruises">Cruises</Link>
        </Menu.Item>
        <Menu.Item key="book" icon={<BookOutlined />}>
          <Link to="/booking">Book</Link>
        </Menu.Item>
        <Menu.Item key="contact" icon={<PhoneOutlined />}>
          <Link to="/contact">Contact</Link>
        </Menu.Item>
        <Menu.Item key="about">
          <Link to="/about">About</Link>
        </Menu.Item>
        <Menu.Item key="saved">
          <Link to="/saved">Saved Trips</Link>
        </Menu.Item>
        <Menu.Item key="login" icon={<LoginOutlined />}>
          <Link to="/login">Login</Link>
        </Menu.Item>
        <Menu.Item key="logout" icon={<LogoutOutlined />}>
          <Link to="/logout">Logout</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default Navbar;
