import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useAuth } from "../context/AuthContext";
import BoardingPassToast from "../components/BoardingPassToast";

export default function Logout() {
  const { logout, user } = useAuth();
  const nav = useNavigate();

  // Snapshot the user's name BEFORE logout so we don't depend on `user` afterward
  const nameRef = useRef(
    user?.name ||
      user?.username ||
      (user?.email ? user.email.split("@")[0] : "Explorer")
  );

  // Guard against double execution in React 18 StrictMode (runs effects twice in dev)
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    // do logout first
    logout();

    // glass boarding-pass style toast
    notification.open({
      message: null,
      description: (
        <BoardingPassToast
          name={nameRef.current}
          routeFrom="Skyrio"
          routeTo="Sign-in"
          // If your BoardingPassToast supports props like subtitle, use it:
          // subtitle="Journey paused — board again anytime ✈️"
        />
      ),
      placement: "topRight",
      duration: 2.2,
      style: { background: "transparent", boxShadow: "none", padding: 0 },
    });

    // give the toast a moment to show before redirect
    const t = setTimeout(() => {
      nav("/login", { replace: true });
    }, 450);

    return () => clearTimeout(t);
  }, [logout, nav]);

  return null;
}