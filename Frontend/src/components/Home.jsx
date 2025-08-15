import { useEffect, useState } from "react";
import API from "../services/api";

export default function Hone() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");

  return (
    <div style={{ padding: 16 }}>
      {err && <p style={{ color: "red" }}>{err}</p>}
      {me ? (
        <pre>{JSON.stringify(me, null, 2)}</pre>
      ) : (
        <p>Register or Log in</p>
      )}
    </div>
  );
}
