import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useAuth } from "../context/AuthContext";
import BoardingPassToast from "../components/BoardingPassToast";

export default function Logout() {
  const { logout, user } = useAuth();
  const nav = useNavigate();

  // Snapshot the user's name BEFORE logout so we don't depend on `user` afterward
  const nameRef = useRef(user?.name || "Explorer");

  // Guard against double execution in React 18 StrictMode (runs effects twice in dev)
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    logout();

    notification.open({
      message: "Signed out",
      description: (
        <div style={{ marginTop: 4 }}>
          See you soon, {nameRef.current}.
          <div style={{ marginTop: 8 }}>
            <BoardingPassToast
              name={nameRef.current}
              routeFrom="Skyrio"
              routeTo="Sign-in"
            />
          </div>
        </div>
      ),
      placement: "topRight",
      duration: 2.5,
    });

    nav("/login", { replace: true });
  }, [logout, nav]); // ✅ only stable dependencies

  return null;
}
