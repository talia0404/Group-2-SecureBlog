import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    // Optional: hit your backend to fetch user/profile
    // Assumes your backend has /auth/me that returns the current user.
    const run = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setMe(data);
      } catch (e) {
        setErr("Could not load profile.");
      }
    };
    run();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Dashboard</h1>
      {err && <p style={{ color: "red" }}>{err}</p>}
      {me ? (
        <pre>{JSON.stringify(me, null, 2)}</pre>
      ) : (
        <p>Loading your info...</p>
      )}
    </div>
  );
}
