import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const LogoutButton = ({children}) => {
  const { logout } = useAuthStore();

  const onLogout = async() => {
    await logout();
  };

  return (
    <button
      className="btn btn-primary"
      onClick={onLogout}
      title="Logout"
    >
      {children}
    </button>
  );
};

export default LogoutButton;

