const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const auth = require("../middleware/auth");
const config = require("../config");
const logger = require("../utils/logger");
const { sendMail } = require("../utils/mailer");

const router = express.Router();

const JWT_SECRET = config.jwtSecret;
const TOKEN_EXPIRY_SECONDS = config.tokenExpirySeconds || 3600;
const DEFAULT_HISTORY_LIMIT = 20;
const MAX_HISTORY_LIMIT = 200;
const MAX_HISTORY_RECORDS = 500;
const DEFAULT_NOTIFICATIONS = {
  email: true,
  sms: false,
  marketplace: true,
  push: true,
};
const ACTIVITY_TYPES = new Set([
  "order",
  "discussion",
  "profile",
  "weather",
  "marketplace",
  "system",
  "disease",
  "scheme",
  "session",
  "advisory",
  "detection",
]);

const createSessionId = () =>
  typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : crypto.randomBytes(16).toString("hex");

const buildSessionState = () => ({
  id: createSessionId(),
  startedAt: new Date(),
  lastActivityAt: new Date(),
});

const buildHistoryPush = (entry) => ({
  $push: {
    history: {
      $each: [entry],
      $slice: -MAX_HISTORY_RECORDS,
    },
  },
});

const buildHistoryEntry = ({ type = "system", title, details, meta }) => ({
  type,
  title,
  details,
  meta,
  occurredAt: new Date(),
});

const normalizeUnit = (unit) => {
  if (typeof unit !== "string") return undefined;
  const normalized = unit.toLowerCase();
  if (["acre", "acres"].includes(normalized)) return "acre";
  if (["hectare", "hectares"].includes(normalized)) return "hectare";
  return undefined;
};

const sanitizeCrops = (crops) =>
  Array.isArray(crops)
    ? crops
        .filter((crop) => typeof crop === "string")
        .map((crop) => crop.trim())
        .filter(Boolean)
    : undefined;

const pickProfileFields = (payload = {}) => {
  const profile = {};
  ["phone", "location", "farmName"].forEach((field) => {
    if (field in payload && typeof payload[field] === "string") {
      profile[field] = payload[field].trim();
    }
  });

  if (payload.farmSize && typeof payload.farmSize === "object") {
    const farmSize = {};
    if (
      Object.prototype.hasOwnProperty.call(payload.farmSize, "value") &&
      !Number.isNaN(Number(payload.farmSize.value))
    ) {
      farmSize.value = Number(payload.farmSize.value);
    }
    const normalizedUnit = normalizeUnit(payload.farmSize.unit);
    if (normalizedUnit) {
      farmSize.unit = normalizedUnit;
    }
    if (Object.keys(farmSize).length) {
      profile.farmSize = farmSize;
    }
  }

  const crops = sanitizeCrops(payload.crops);
  if (crops) {
    profile.crops = crops;
  }

  if (payload.preferences && typeof payload.preferences === "object") {
    const pref = {};
    if (payload.preferences.notifications && typeof payload.preferences.notifications === "object") {
      const notifications = {};
      ["email", "sms", "marketplace", "push"].forEach((key) => {
        if (typeof payload.preferences.notifications[key] === "boolean") {
          notifications[key] = payload.preferences.notifications[key];
        }
      });
      if (Object.keys(notifications).length) {
        pref.notifications = notifications;
      }
    }
    if (Object.keys(pref).length) {
      profile.preferences = pref;
    }
  }

  return profile;
};

const flattenObject = (obj, prefix = "") => {
  const result = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) return;
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value) || value === null || typeof value !== "object") {
      result[path] = value;
    } else if (Object.keys(value).length) {
      Object.assign(result, flattenObject(value, path));
    }
  });
  return result;
};

const buildProfileUpdatePayload = (payload = {}) => {
  const updates = {};
  const changedFields = new Set();
  const errors = [];

  if (Object.prototype.hasOwnProperty.call(payload, "name")) {
    if (typeof payload.name !== "string" || !payload.name.trim()) {
      errors.push("Name cannot be empty.");
    } else {
      updates.name = payload.name.trim();
      changedFields.add("name");
    }
  }

  const nested = pickProfileFields(payload);
  const flattened = flattenObject(nested);
  Object.entries(flattened).forEach(([key, value]) => {
    updates[key] = value;
    changedFields.add(key);
  });

  return { updates, changedFields: Array.from(changedFields), errors };
};

const humanizeFieldPath = (path) => {
  const map = {
    name: "name",
    phone: "phone number",
    location: "location",
    "location.city": "city",
    "location.state": "state",
    "location.country": "country",
    farmName: "farm name",
    farmSize: "farm size",
    crops: "crops",
    "preferences.notifications.email": "email notifications",
    "preferences.notifications.sms": "sms notifications",
    "preferences.notifications.push": "push notifications",
  };

  return map[path] || path;
};
const buildUserResponse = (user, { includeHistory = false, historyLimit = 0 } = {}) => {
  const notifications = {
    ...DEFAULT_NOTIFICATIONS,
    ...(user.preferences?.notifications || {}),
  };

  const base = {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    location: user.location || "",
    farmName: user.farmName || "",
    farmSize: user.farmSize || null,
    crops: user.crops || [],
    preferences: { notifications },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  if (user.currentSession) {
    base.session = {
      id: user.currentSession.id,
      startedAt: user.currentSession.startedAt,
      lastActivityAt: user.currentSession.lastActivityAt,
      endedAt: user.currentSession.endedAt,
    };
  }

  if (includeHistory) {
    const history = Array.isArray(user.history) ? [...user.history] : [];
    history.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
    base.history = historyLimit ? history.slice(0, historyLimit) : history;
  }

  return base;
};

const issueToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY_SECONDS }
  );

// User Registration
const handleSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "All fields are required.",
        requiredFields: ["name", "email", "password"]
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const profileFields = pickProfileFields(req.body);
    const newUser = new User({ 
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      ...profileFields,
      history: [
        buildHistoryEntry({
          type: "system",
          title: "Account created",
          details: "Welcome to AgriConnect",
        }),
      ],
    });
    await newUser.save();

    // Generate JWT token
    const token = issueToken(newUser);

    const sessionState = buildSessionState();
    const sessionEntry = buildHistoryEntry({
      type: "session",
      title: "Signed in",
      details: "Session started immediately after registration",
      meta: { sessionId: sessionState.id },
    });

    const userWithSession = await User.findByIdAndUpdate(
      newUser._id,
      {
        $set: { currentSession: sessionState },
        ...buildHistoryPush(sessionEntry),
      },
      { new: true }
    )
      .select("-password")
      .slice("history", -DEFAULT_HISTORY_LIMIT);

    res.status(201).json({ 
      message: "User registered successfully!",
      token,
      expiresIn: TOKEN_EXPIRY_SECONDS,
      session: sessionState,
      user: buildUserResponse(userWithSession, { includeHistory: true, historyLimit: 5 }),
    });
  } catch (error) {
    logger.error("Signup error", { error });
    res.status(500).json({ message: "Internal server error." });
  }
};

router.post("/signup", handleSignup);
router.post("/sign-up", handleSignup);

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required.",
        requiredFields: ["email", "password"]
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = issueToken(user);

    const sessionState = buildSessionState();
    const sessionEntry = buildHistoryEntry({
      type: "session",
      title: "Signed in",
      details: "User authenticated successfully",
      meta: { sessionId: sessionState.id },
    });

    const userWithSession = await User.findByIdAndUpdate(
      user._id,
      {
        $set: { currentSession: sessionState },
        ...buildHistoryPush(sessionEntry),
      },
      { new: true }
    )
      .select("-password")
      .slice("history", -DEFAULT_HISTORY_LIMIT);

    res.json({ 
      message: "Login successful",
      token,
      expiresIn: TOKEN_EXPIRY_SECONDS,
      session: sessionState,
      user: buildUserResponse(userWithSession, { includeHistory: true, historyLimit: DEFAULT_HISTORY_LIMIT }),
    });
  } catch (error) {
    logger.error("Login error", { error });
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const includeHistory = req.query.includeHistory === "true";
    const requestedLimit = parseInt(req.query.historyLimit, 10);
    const historyLimit = includeHistory
      ? Math.min(
          Math.max(Number.isNaN(requestedLimit) ? DEFAULT_HISTORY_LIMIT : requestedLimit, 1),
          MAX_HISTORY_LIMIT
        )
      : 0;

    const query = User.findById(req.user.userId).select("-password");
    if (includeHistory && historyLimit > 0) {
      query.slice("history", -historyLimit);
    }

    const user = await query;
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      user: buildUserResponse(user, { includeHistory, historyLimit }),
    });
  } catch (error) {
    logger.error("Profile fetch error", { error });
    res.status(500).json({ message: "Internal server error." });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { updates, changedFields, errors } = buildProfileUpdatePayload(req.body);

    if (errors.length) {
      return res.status(400).json({ message: errors[0] });
    }

    if (!changedFields.length) {
      return res.status(400).json({ message: "No valid fields were provided for update." });
    }

    const currentUser = await User.findById(req.user.userId).select("currentSession");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const sessionId = currentUser.currentSession?.id;
    const now = new Date();
    const historyEntry = buildHistoryEntry({
      type: "profile",
      title: "Profile updated",
      details: `Fields updated: ${changedFields.map(humanizeFieldPath).join(", ")}`,
      meta: sessionId ? { sessionId } : undefined,
    });

    const updateOps = {
      $set: {
        ...updates,
        ...(sessionId ? { "currentSession.lastActivityAt": now } : {}),
      },
      ...buildHistoryPush(historyEntry),
    };

    const user = await User.findByIdAndUpdate(req.user.userId, updateOps, { new: true }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      message: "Profile updated successfully",
      user: buildUserResponse(user, { includeHistory: true, historyLimit: DEFAULT_HISTORY_LIMIT }),
    });
  } catch (error) {
    logger.error("Profile update error", { error });
    res.status(500).json({ message: "Internal server error." });
  }
});

// Change password
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Current password and new password are required." 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "New password must be at least 6 characters long." 
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const sessionId = user.currentSession?.id;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const historyEntry = buildHistoryEntry({
      type: "profile",
      title: "Password changed",
      details: "Password updated via account settings",
      meta: sessionId ? { sessionId } : undefined,
    });

    // Update password
    await User.findByIdAndUpdate(req.user.userId, {
      $set: {
        password: hashedPassword,
        ...(sessionId ? { "currentSession.lastActivityAt": new Date() } : {}),
      },
      ...buildHistoryPush(historyEntry),
    });

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    logger.error("Password change error", { error });
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({ message: "If the email exists, reset instructions were sent." });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = expiresAt;
    user.history = user.history || [];
    user.history.push(
      buildHistoryEntry({
        type: "profile",
        title: "Password reset requested",
        details: "Reset email issued",
      })
    );
    if (user.history.length > MAX_HISTORY_RECORDS) {
      user.history = user.history.slice(-MAX_HISTORY_RECORDS);
    }

    await user.save();

    const resetUrl = `${config.mail.resetUrl}?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
    const responsePayload = { message: "If the email exists, reset instructions were sent." };

    if (!config.mail?.enabled) {
      if (config.env === "production") {
        return res.status(503).json({ message: "Password reset email is not configured." });
      }

      logger.warn("Password reset email attempted without SMTP configuration. Exposing link for development only.");
      responsePayload.resetUrl = resetUrl;
      return res.json(responsePayload);
    }

    const subject = "Reset your AgriConnect password";
    const html = `
      <p>Hi ${user.name || "there"},</p>
      <p>You recently requested to reset your AgriConnect password. Click the link below to set a new password. This link will expire in 15 minutes.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>If you did not request this change, please ignore this email.</p>
      <p>— The AgriConnect team</p>
    `;
    const text = `Hi ${user.name || "there"},\n\nUse the link below to reset your AgriConnect password (valid for 15 minutes):\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`;

    await sendMail({ to: user.email, subject, text, html });

    res.json(responsePayload);
  } catch (error) {
    logger.error("Forgot password error", { error });
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, email, newPassword } = req.body || {};

    if (!token || !email || !newPassword) {
      return res.status(400).json({ message: "Token, email, and new password are required." });
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.history = user.history || [];
    user.history.push(
      buildHistoryEntry({
        type: "profile",
        title: "Password reset",
        details: "Password reset via email link",
      })
    );
    if (user.history.length > MAX_HISTORY_RECORDS) {
      user.history = user.history.slice(-MAX_HISTORY_RECORDS);
    }

    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (error) {
    logger.error("Reset password error", { error });
    res.status(500).json({ message: "Internal server error." });
  }
});

// Record custom activity events (disease predictions, schemes, etc.)
router.post("/activity", auth, async (req, res) => {
  try {
    const { type, title, details, meta, sessionId: providedSessionId } = req.body || {};

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Activity title is required." });
    }

    const requestedType = typeof type === "string" ? type.toLowerCase() : undefined;
    const normalizedType = requestedType && ACTIVITY_TYPES.has(requestedType)
      ? requestedType
      : "system";

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.history) {
      user.history = [];
    }

    if (!user.currentSession) {
      user.currentSession = buildSessionState();
      user.history.push(
        buildHistoryEntry({
          type: "session",
          title: "Session restored",
          details: "New session created while logging activity",
          meta: { sessionId: user.currentSession.id },
        })
      );
    }

    const activeSessionId = providedSessionId || user.currentSession.id;

    const entry = buildHistoryEntry({
      type: normalizedType,
      title: title.trim(),
      details: typeof details === "string" ? details.trim() : undefined,
      meta: {
        ...(meta && typeof meta === "object" ? meta : {}),
        sessionId: activeSessionId,
      },
    });

    user.history.push(entry);
    if (user.history.length > MAX_HISTORY_RECORDS) {
      user.history = user.history.slice(-MAX_HISTORY_RECORDS);
    }

    user.currentSession.lastActivityAt = new Date();

    await user.save();

    res.json({ message: "Activity recorded", entry });
  } catch (error) {
    logger.error("Activity logging error", { error });
    res.status(500).json({ message: "Internal server error." });
  }
});

// Fetch user history
router.get("/history", auth, async (req, res) => {
  try {
    const requestedLimit = parseInt(req.query.limit, 10);
    const limit = Math.min(
      Number.isNaN(requestedLimit) ? DEFAULT_HISTORY_LIMIT : Math.max(requestedLimit, 1),
      MAX_HISTORY_LIMIT
    );

    const user = await User.findById(req.user.userId)
      .select("history")
      .slice("history", -limit);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const history = Array.isArray(user.history)
      ? [...user.history].sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt))
      : [];

    res.json({ history });
  } catch (error) {
    logger.error("History fetch error", { error });
    res.status(500).json({ message: "Internal server error." });
  }
});

// Verify token
router.get("/verify", auth, (req, res) => {
  res.json({ 
    valid: true,
    user: {
      id: req.user.userId,
      email: req.user.email,
      name: req.user.name
    }
  });
});

module.exports = router;
