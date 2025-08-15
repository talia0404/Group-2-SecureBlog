export const getToken = () => localStorage.getItem("token");

export const parseJwt = (token) => {
  try {
    // JWT format: header.payload.signature (payload is base64url)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
};

export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;

  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;

  // exp is in seconds; Date.now() is ms
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp > nowInSeconds;
};

export const isLoggedIn = () => !!getToken() && isTokenValid();
