import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🛠️ Admin Dashboard</h1>
      <p className="text-gray-700 mb-6">
        Welcome, Admin. Manage your platform here.
      </p>
      <Button type="primary" danger onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default AdminDashboard;
