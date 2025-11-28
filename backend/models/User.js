// user.js (Model file)
const mongoose = require('mongoose');

const historyEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
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
      ],
      default: "system",
    },
    title: { type: String, required: true },
    details: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed },
    occurredAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    id: { type: String },
    startedAt: { type: Date },
    lastActivityAt: { type: Date },
    endedAt: { type: Date },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    farmName: {
      type: String,
      trim: true,
    },
    farmSize: {
      value: { type: Number },
      unit: { type: String, enum: ["acre", "hectare"] },
    },
    crops: {
      type: [String],
      default: [],
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        marketplace: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
    },
    history: {
      type: [historyEventSchema],
      default: [],
    },
    currentSession: sessionSchema,
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
