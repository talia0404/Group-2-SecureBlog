// src/components/Navbar.jsx
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();

  // Re-check auth whenever the route changes
  useEffect(() => {
    setAuthed(!!localStorage.getItem("token"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthed(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">SecureBlog</div>

        <ul>

          {authed ? (
            <>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li>
                <button className="logout-link" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/home">Home</NavLink></li>
              <li><NavLink to="/register">Register</NavLink></li>
              <li><NavLink to="/login">Login</NavLink></li>
            </>
          )}
        </ul>
      </nav>

      {/* spacer so fixed navbar doesn't cover your content */}
      <div className="navbar-spacer" />
    </>
  );
}
