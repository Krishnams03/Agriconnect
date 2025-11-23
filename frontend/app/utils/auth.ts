// @/app/utils/auth.ts

// Key Constants for Local Storage
const SESSION_KEY = "user_session";
const AUTH_TOKEN_KEY = "auth_token";
const TOKEN_EXPIRY_KEY = "token_expiry";

/* --------------------------------------
   1. SAVE SESSION AND USER INFO
-------------------------------------- */
export const saveUserSession = (username: string, token: string, expiryTime?: number) => {
  const sessionData = {
    username,
    createdAt: new Date().toISOString(),
  };

  // Save session to localStorage
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

  // Save authentication token
  localStorage.setItem(AUTH_TOKEN_KEY, token);

  // Save optional token expiry time if provided
  if (expiryTime) {
    const expiryDate = new Date().getTime() + expiryTime * 1000; // expiryTime in seconds
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toString());
  }

  console.log("Session saved:", sessionData);
};

/* --------------------------------------
   2. GET SESSION DATA
-------------------------------------- */
export const getUserSession = () => {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
  return null;
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
};

/* --------------------------------------
   3. VALIDATE USER SESSION
-------------------------------------- */
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  const token = getAuthToken();
  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);

  // Validate token existence and expiry
  if (token) {
    if (expiryTime) {
      const currentTime = new Date().getTime();
      return currentTime < parseInt(expiryTime); // Return true if token hasn't expired
    }
    return true; // Token exists without an expiry time
  }
  return false;
};

/* --------------------------------------
   4. CLEAR SESSION (LOGOUT)
-------------------------------------- */
export const clearUserSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  console.log("User session cleared successfully.");
};

/* --------------------------------------
   5. GET USER INFO
-------------------------------------- */
export const getUserInfo = () => {
  const session = getUserSession();
  if (session) {
    return session.username ? { username: session.username } : null;
  }
  return null;
};

/* --------------------------------------
   6. CHECK TOKEN EXPIRY
-------------------------------------- */
export const isTokenExpired = (): boolean => {
  if (typeof window === "undefined") return true;

  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryTime) return false; // No expiry time set

  const currentTime = new Date().getTime();
  return currentTime > parseInt(expiryTime); // Check if token has expired
};

/* --------------------------------------
   7. EXTEND SESSION TIME (OPTIONAL)
-------------------------------------- */
export const extendSession = (extraTimeInSeconds: number) => {
  if (typeof window === "undefined") return;

  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (expiryTime) {
    const newExpiryTime = parseInt(expiryTime) + extraTimeInSeconds * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, newExpiryTime.toString());
    console.log(`Session extended by ${extraTimeInSeconds} seconds.`);
  }
};
