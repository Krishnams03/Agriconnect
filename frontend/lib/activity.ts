import axios from "axios";
import { getAuthToken, getCurrentSessionId, updateSessionMetadata } from "@/app/utils/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export interface ActivityPayload {
  type: string;
  title: string;
  details?: string;
  meta?: Record<string, unknown>;
  sessionId?: string;
}

export interface ActivityResponseEntry {
  type: string;
  title: string;
  details?: string;
  meta?: Record<string, unknown>;
  occurredAt: string;
}

export const logUserActivity = async (payload: ActivityPayload): Promise<ActivityResponseEntry | null> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    const sessionId = payload.sessionId ?? getCurrentSessionId();
    const response = await axios.post<{ entry: ActivityResponseEntry }>(
      `${API_BASE_URL}/api/auth/activity`,
      {
        ...payload,
        sessionId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    updateSessionMetadata({ lastActivityAt: new Date().toISOString() });
    return response.data.entry;
  } catch (error) {
    console.warn("Unable to log activity", error);
    return null;
  }
};
