import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token
    localStorage.removeItem("token");

    // Redirect to login
    navigate("/login", { replace: true });
  }, [navigate]);

  // Nothing to render
  return null; 
};

export default Logout;
