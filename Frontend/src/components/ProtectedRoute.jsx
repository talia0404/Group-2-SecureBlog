import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { isLoggedIn } from "../utils/auth";

export default function ProtectedRoute() {
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Run the check synchronously on mount and on path change
    const ok = isLoggedIn();
    setAllowed(ok);
    setChecked(true);
  }, [location.pathname]);

  if (!checked) {
    // Prevents flash of protected content
    return null;
  }

  return allowed
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
}
