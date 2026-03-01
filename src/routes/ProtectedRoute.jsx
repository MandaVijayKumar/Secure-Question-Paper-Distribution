import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, role }) => {

  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);

    console.log("Decoded token:", decoded);

    if (decoded.role !== role) {
      return <Navigate to="/" />;
    }

    return children;

  } catch (err) {
    console.log("Token error:", err);
    localStorage.removeItem("accessToken");
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;