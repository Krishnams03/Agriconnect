"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  History as HistoryIcon,
  Leaf,
  LogOut,
  RefreshCw,
  Shield,
} from "lucide-react";
import {
  SessionUser,
  clearUserSession,
  getAuthToken,
  getUserSession,
  updateUserSession,
  type SessionMetadata,
} from "@/app/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import "@/app/globals.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const HISTORY_LIMIT = 50;

interface HistoryEntry {
  type: string;
  title: string;
  details?: string;
  occurredAt: string;
  meta?: {
    sessionId?: string;
    [key: string]: unknown;
  };
}

interface ProfileResponse {
  user: UserProfile;
  session?: SessionMetadata | null;
}

type NotificationsState = {
  email: boolean;
  sms: boolean;
  marketplace: boolean;
  push: boolean;
};

interface UserProfile extends SessionUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  farmName?: string;
  farmSize?: { value?: number; unit?: string } | null;
  crops?: string[];
  history?: HistoryEntry[];
  preferences?: {
    notifications?: Partial<NotificationsState>;
  };
  session?: SessionMetadata | null;
}

interface ProfileFormState {
  name: string;
  email: string;
  phone: string;
  location: string;
  farmName: string;
  farmSizeValue: string;
  farmSizeUnit: string;
  crops: string;
  notifications: NotificationsState;
}

interface StatusMessage {
  kind: "success" | "error" | "info";
  message: string;
}

const notificationDefaults: NotificationsState = {
  email: true,
  sms: false,
  marketplace: true,
  push: true,
};

const createEmptyFormState = (): ProfileFormState => ({
  name: "",
  email: "",
  phone: "",
  location: "",
  farmName: "",
  farmSizeValue: "",
  farmSizeUnit: "acre",
  crops: "",
  notifications: { ...notificationDefaults },
});

const toFormState = (profile?: UserProfile): ProfileFormState => ({
  name: profile?.name ?? "",
  email: profile?.email ?? "",
  phone: profile?.phone ?? "",
  location: profile?.location ?? "",
  farmName: profile?.farmName ?? "",
  farmSizeValue: profile?.farmSize?.value?.toString() ?? "",
  farmSizeUnit: profile?.farmSize?.unit ?? "acre",
  crops: profile?.crops?.join(", ") ?? "",
  notifications: {
    ...notificationDefaults,
    ...(profile?.preferences?.notifications ?? {}),
  },
});

const formatHistoryDate = (iso?: string) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

const parseFarmSizeUnit = (unit?: string) => {
  if (!unit) return "";
  return unit.toLowerCase();
};

const buildProfilePayload = (state: ProfileFormState) => {
  const payload: Record<string, unknown> = {
    name: state.name.trim(),
    email: state.email.trim(),
  };

  if (!payload.name) {
    throw new Error("Name cannot be empty.");
  }

  if (state.phone.trim()) {
    payload.phone = state.phone.trim();
  }

  if (state.location.trim()) {
    payload.location = state.location.trim();
  }

  if (state.farmName.trim()) {
    payload.farmName = state.farmName.trim();
  }

  const parsedValue = Number(state.farmSizeValue.trim());
  const normalizedUnit = parseFarmSizeUnit(state.farmSizeUnit);
  if (!Number.isNaN(parsedValue) || normalizedUnit) {
    const farmSize: Record<string, unknown> = {};
    if (!Number.isNaN(parsedValue)) {
      farmSize.value = parsedValue;
    }
    if (normalizedUnit) {
      farmSize.unit = normalizedUnit;
    }
    if (Object.keys(farmSize).length) {
      payload.farmSize = farmSize;
    }
  }

  const crops = state.crops
    .split(/,|\n/)
    .map((crop) => crop.trim())
    .filter(Boolean);
  if (crops.length) {
    payload.crops = crops;
  }

  payload.preferences = {
    notifications: state.notifications,
  };

  return payload;
};

export default function AccountDetails() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [formState, setFormState] = useState<ProfileFormState>(createEmptyFormState());
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [historyRefreshing, setHistoryRefreshing] = useState(false);

  const handleSignOut = useCallback(() => {
    clearUserSession();
    router.replace("/log-in");
  }, [router]);

  const ensureToken = useCallback(() => {
    const token = getAuthToken();
    if (!token) {
      handleSignOut();
      return null;
    }
    return token;
  }, [handleSignOut]);

  const handleRequestError = useCallback(
    (error: unknown, fallback: string) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError?.response?.status === 401) {
        setStatus({ kind: "error", message: "Session expired. Please sign in again." });
        handleSignOut();
        return;
      }
      const message = axiosError?.response?.data?.message ?? fallback;
      setStatus({ kind: "error", message });
    },
    [handleSignOut]
  );

  const fetchProfile = useCallback(
    async (options?: { silent?: boolean }) => {
      const token = ensureToken();
      if (!token) return;

      if (options?.silent) {
        setHistoryRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await axios.get<ProfileResponse>(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { includeHistory: "true", historyLimit: HISTORY_LIMIT },
        });

        const fetched = response.data.user;
        setProfile(fetched);
        setFormState(toFormState(fetched));
        setHistory(fetched.history ?? []);
        updateUserSession({ user: fetched, username: fetched.name, email: fetched.email });
      } catch (error) {
        handleRequestError(error, "Unable to load profile details.");
      } finally {
        if (options?.silent) {
          setHistoryRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [ensureToken, handleRequestError]
  );

  useEffect(() => {
    const session = getUserSession();
    if (!session) {
      router.replace("/log-in");
      return;
    }
    fetchProfile();
    router.prefetch("/");
  }, [fetchProfile, router]);

  useEffect(() => {
    if (!status) return;
    const timeout = setTimeout(() => setStatus(null), 4500);
    return () => clearTimeout(timeout);
  }, [status]);

  const handleFieldChange = (field: keyof ProfileFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (key: keyof NotificationsState) => {
    setFormState((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = ensureToken();
    if (!token) return;

    setIsSavingProfile(true);
    try {
      const payload = buildProfilePayload(formState);
      const response = await axios.put<ProfileResponse>(`${API_BASE_URL}/api/auth/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = response.data.user;
      setProfile(updated);
      setFormState(toFormState(updated));
      setHistory(updated.history ?? []);
      updateUserSession({ user: updated, username: updated.name, email: updated.email });
      setStatus({ kind: "success", message: "Profile updated successfully." });
    } catch (error) {
      if (error instanceof Error && error.message === "Name cannot be empty.") {
        setStatus({ kind: "error", message: error.message });
      } else {
        handleRequestError(error, "Unable to update profile.");
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = ensureToken();
    if (!token) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatus({ kind: "error", message: "New passwords do not match." });
      return;
    }

    setIsSavingPassword(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/auth/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setStatus({ kind: "success", message: "Password updated successfully." });
      fetchProfile({ silent: true });
    } catch (error) {
      handleRequestError(error, "Unable to change password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleHistoryRefresh = () => {
    fetchProfile({ silent: true });
  };

  const displayedHistory = useMemo(() => {
    return [...history].sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
  }, [history]);

  const statusIcon = status?.kind === "error" ? (
    <AlertTriangle className="h-4 w-4" />
  ) : (
    <CheckCircle2 className="h-4 w-4" />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Leaf className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold">AgriConnect</span>
            </Link>
            <span className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
              <ArrowLeft className="h-3.5 w-3.5" /> Return to dashboard
            </span>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </motion.header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-semibold text-slate-900">Account settings</h1>
          <p className="mt-2 text-sm text-slate-500">
            Update your profile, manage notifications, and review recent account activity.
          </p>
        </motion.div>

        {status && (
          <div
            className={`mb-8 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
              status.kind === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {statusIcon}
            <span>{status.message}</span>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
            {[0, 1, 2].map((key) => (
              <div
                key={key}
                className="h-64 animate-pulse rounded-3xl border border-slate-200/70 bg-white/70"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr,1fr]">
            <div className="space-y-8">
              <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Profile overview</h2>
                    <p className="text-sm text-slate-500">
                      Details shared across marketplace, advisory, and support.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Full name</label>
                      <Input
                        value={formState.name}
                        onChange={(event) => handleFieldChange("name", event.target.value)}
                        required
                        placeholder="Your name"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Email</label>
                      <Input value={formState.email} disabled className="mt-2" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Phone</label>
                      <Input
                        value={formState.phone}
                        onChange={(event) => handleFieldChange("phone", event.target.value)}
                        placeholder="Add a reachable number"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Location</label>
                      <Input
                        value={formState.location}
                        onChange={(event) => handleFieldChange("location", event.target.value)}
                        placeholder="City, region or village"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Farm name</label>
                      <Input
                        value={formState.farmName}
                        onChange={(event) => handleFieldChange("farmName", event.target.value)}
                        placeholder="Registered farm or operation"
                        className="mt-2"
                      />
                    </div>
                    <div className="grid grid-cols-[1.2fr,0.8fr] gap-3">
                      <div>
                        <label className="text-sm font-medium text-slate-600">Farm size</label>
                        <Input
                          value={formState.farmSizeValue}
                          onChange={(event) => handleFieldChange("farmSizeValue", event.target.value)}
                          placeholder="eg. 12"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Unit</label>
                        <select
                          aria-label="Farm size unit"
                          value={formState.farmSizeUnit}
                          onChange={(event) => handleFieldChange("farmSizeUnit", event.target.value)}
                          className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="acre">Acres</option>
                          <option value="hectare">Hectares</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">Active crops</label>
                    <Textarea
                      value={formState.crops}
                      onChange={(event) => handleFieldChange("crops", event.target.value)}
                      placeholder="Example: Wheat, Cotton, Maize"
                      className="mt-2"
                    />
                    <p className="mt-1 text-xs text-slate-400">Separate crops with commas.</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-600">Notifications</h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {(
                        [
                          { key: "email", label: "Email alerts" },
                          { key: "sms", label: "SMS summaries" },
                          { key: "marketplace", label: "Marketplace updates" },
                          { key: "push", label: "Push notifications" },
                        ] as const
                      ).map(({ key, label }) => (
                        <label
                          key={key}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                        >
                          <span className="text-slate-600">{label}</span>
                          <input
                            type="checkbox"
                            checked={formState.notifications[key]}
                            onChange={() => handleNotificationToggle(key)}
                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={isSavingProfile} className="gap-2">
                      {isSavingProfile ? "Saving changes..." : "Save changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => profile && setFormState(toFormState(profile))}
                      disabled={isSavingProfile}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </section>

              <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Security</h2>
                    <p className="text-sm text-slate-500">Update your password to keep data protected.</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Current password</label>
                      <Input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                        }
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">New password</label>
                      <Input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
                        }
                        required
                        minLength={6}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Confirm new password</label>
                      <Input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                        }
                        required
                        minLength={6}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSavingPassword} className="gap-2">
                    {isSavingPassword ? "Updating password..." : "Update password"}
                  </Button>
                </form>
              </section>
            </div>

            <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <HistoryIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Activity history</h2>
                    <p className="text-sm text-slate-500">Latest profile and security events.</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleHistoryRefresh} disabled={historyRefreshing}>
                  <RefreshCw className={`h-4 w-4 ${historyRefreshing ? "animate-spin" : ""}`} />
                </Button>
              </div>

              {profile?.session && (
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-700">Active session</p>
                  <p className="mt-1">
                    Started {formatHistoryDate(profile.session.startedAt)}
                    {profile.session.id ? ` · #${profile.session.id.slice(0, 8)}` : ""}
                  </p>
                  {profile.session.lastActivityAt && (
                    <p className="text-xs text-slate-500">
                      Last activity {formatHistoryDate(profile.session.lastActivityAt)}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6 space-y-4">
                {displayedHistory.length === 0 ? (
                  <p className="text-sm text-slate-500">No activity recorded yet.</p>
                ) : (
                  displayedHistory.map((entry, index) => (
                    <div
                      key={`${entry.title}-${entry.occurredAt}-${index}`}
                      className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                    >
                      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                        <span>{entry.type}</span>
                        <span>{formatHistoryDate(entry.occurredAt)}</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-slate-800">{entry.title}</p>
                      {entry.details && <p className="text-sm text-slate-500">{entry.details}</p>}
                      {entry.meta?.sessionId && (
                        <p className="text-xs text-slate-400">Session #{String(entry.meta.sessionId).slice(0, 8)}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
