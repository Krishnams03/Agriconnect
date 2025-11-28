// @/app/utils/auth.ts

// Key Constants for Local Storage
const SESSION_KEY = "user_session";
const AUTH_TOKEN_KEY = "auth_token";
const TOKEN_EXPIRY_KEY = "token_expiry";

export interface SessionMetadata {
  id?: string;
  startedAt?: string;
  lastActivityAt?: string;
  endedAt?: string;
}

export interface SessionUser {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: Record<string, unknown> | string;
  farmName?: string;
  farmSize?: { value?: number; unit?: string } | null;
  crops?: string[];
  preferences?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  session?: SessionMetadata | null;
  [key: string]: unknown;
}

export interface StoredSession {
  user?: SessionUser;
  username?: string;
  email?: string;
  createdAt: string;
  session?: SessionMetadata | null;
}

/* --------------------------------------
   1. SAVE SESSION AND USER INFO
-------------------------------------- */
export const saveUserSession = (
  userOrName: string | SessionUser,
  token: string,
  expiryTime?: number,
  emailFallback?: string,
  sessionMeta?: SessionMetadata | null
) => {
  const normalizedUser: SessionUser =
    typeof userOrName === "string"
      ? { name: userOrName, email: emailFallback ?? userOrName }
      : {
          ...userOrName,
          email: userOrName.email ?? emailFallback,
        };

  const derivedSession = sessionMeta ?? (normalizedUser.session ?? null);

  const sessionData: StoredSession = {
    user: normalizedUser,
    username: normalizedUser.name ?? (typeof userOrName === "string" ? userOrName : undefined),
    email: normalizedUser.email ?? emailFallback ?? normalizedUser.name,
    createdAt: new Date().toISOString(),
    session: derivedSession ?? null,
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
export const getUserSession = (): StoredSession | null => {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    try {
      return JSON.parse(session) as StoredSession;
    } catch (error) {
      console.warn("Invalid session payload detected, clearing.", error);
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
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
export interface UserInfo {
  id?: string;
  username?: string;
  email?: string;
  name?: string;
}

export const getUserInfo = (): UserInfo | null => {
  const session = getUserSession();
  if (!session) {
    return null;
  }

  const fallbackName = session.username ?? session.email ?? session.user?.name;
  return {
    id: session.user?.id,
    username: session.username ?? session.user?.name,
    email: session.email ?? session.user?.email,
    name: session.user?.name ?? fallbackName ?? undefined,
  };
};

export const getCurrentSession = (): SessionMetadata | null => {
  const session = getUserSession();
  if (!session) {
    return null;
  }

  return session.session ?? session.user?.session ?? null;
};

export const getCurrentSessionId = (): string | null => {
  const current = getCurrentSession();
  return current?.id ?? null;
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

/* --------------------------------------
   8. UPDATE SESSION DATA
-------------------------------------- */
interface SessionUpdate {
  username?: string;
  email?: string;
  token?: string;
  user?: SessionUser;
  session?: SessionMetadata | null;
}

export const updateUserSession = (updates: SessionUpdate) => {
  if (typeof window === "undefined") return;

  const existing = getUserSession();
  if (!existing) return;

  const mergedUser = updates.user ? { ...existing.user, ...updates.user } : existing.user;
  const nextSessionMeta =
    Object.prototype.hasOwnProperty.call(updates, "session")
      ? updates.session ?? null
      : updates.user?.session
      ? (updates.user.session as SessionMetadata | null)
      : existing.session ?? mergedUser?.session ?? null;

  const nextSession: StoredSession = {
    ...existing,
    ...("username" in updates ? { username: updates.username } : {}),
    ...("email" in updates ? { email: updates.email } : {}),
    user: mergedUser,
    session: nextSessionMeta ?? null,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));

  if (updates.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, updates.token);
  }
};

export const updateSessionMetadata = (metadata: Partial<SessionMetadata>) => {
  if (typeof window === "undefined") return;
  const existing = getUserSession();
  if (!existing) return;

  const currentSession = existing.session ?? existing.user?.session;
  const updatedSession = { ...currentSession, ...metadata } as SessionMetadata;

  updateUserSession({ session: updatedSession });
};

/* --------------------------------------
   9. DELETE ACCOUNT (LOCAL SESSION CLEAR)
-------------------------------------- */
export const deleteUserAccount = () => {
  clearUserSession();
};
