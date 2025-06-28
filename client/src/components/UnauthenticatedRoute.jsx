import React from "react";
import { Navigate } from "react-router-dom";

const UnauthenticatedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    // Redirect based on role
    if (user.role === "admin") return <Navigate to="/admin" />;
    if (user.role === "agent") return <Navigate to="/agent" />;
    return <Navigate to="/customer/book" />;
  }

  return children;
};

export default UnauthenticatedRoute;
