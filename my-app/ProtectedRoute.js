import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken"); // Retrieve token from local storage

    // If token is not found, redirect to /login
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Only render the children if a token is present
  const token = localStorage.getItem("userToken");
  return token ? children : null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Use 'node' for React children
};

export default ProtectedRoute;
