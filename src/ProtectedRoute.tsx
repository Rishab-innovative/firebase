import React, { useEffect } from "react";
import { Route, Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  component: any;
  isLoggedIn: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  isLoggedIn,
}) => {
  
  console.log("isloggedIn", isLoggedIn);
  return isLoggedIn ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;
