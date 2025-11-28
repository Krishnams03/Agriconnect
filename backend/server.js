const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const FormData = require("form-data");

const config = require("./config");
const logger = require("./utils/logger");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(
  cors({
    origin: config.frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(config.mongoUri)
  .then(() => logger.info("MongoDB connected successfully"))
  .catch((error) => {
    logger.error("MongoDB connection error", { error });
    process.exit(1);
  });

// --- User Schema ---
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// --- Discussion Schema ---
const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], required: true },
  author: { type: String, default: "Anonymous" },
  date: { type: Date, default: Date.now },
});
const Discussion = mongoose.model("Discussion", discussionSchema);

const orderSchema = new mongoose.Schema(
  {
    paymentId: String,
    items: { type: Array, default: [] },
    amount: Number,
    status: { type: String, default: "Pending" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", orderSchema);

// --- Routes ---

// 1. Root Endpoint
app.get("/", (req, res) => {
  res.send("Success");
});

// Plant Identification Route (Pl@ntNet API)
app.post("/api/identify-plant", upload.single("images"), async (req, res) => {
  const { organs } = req.body; // organs (e.g., leaf, flower)
  const imageFile = req.file; // The uploaded image file

  if (!imageFile || !organs) {
    return res.status(400).json({ message: "Please provide both images and organs for identification." });
  }

  try {
    const formData = new FormData();
    formData.append("organs", organs);
    formData.append("images", imageFile.buffer, {
      filename: imageFile.originalname || "upload.jpg",
      contentType: imageFile.mimetype,
    });

    const response = await axios.post(
      "https://my.plantnet.org/v2/identify/all", // Pl@ntNet API endpoint
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${config.apiKeys.plantNet}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    logger.error("Error identifying plant with Pl@ntNet API", { error });
    res.status(500).json({ message: "Error identifying plant. Please try again later.", error: error.message });
  }
});

// 3. Plant Search Route (Trefle API)
app.get("/api/plant-search", async (req, res) => {
  const plantName = req.query.q;
  if (!plantName) {
    return res.status(400).json({ message: "Please provide a plant name to search." });
  }

  try {
    const response = await axios.get("https://trefle.io/api/v1/plants/search", {
      params: { q: plantName, token: config.apiKeys.trefle },
    });
    res.json(response.data);
  } catch (error) {
    logger.error("Error fetching data from Trefle API", { error });
    res.status(500).json({ message: "Error fetching data from Trefle API", error: error.message });
  }
});

// 4. User Sign-Up
app.post("/api/auth/sign-up", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Sign-up successful! Please log in." });
  } catch (error) {
    logger.error("Error during sign-up", { error });
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// 5. User Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.tokenExpirySeconds }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    logger.error("Error during login", { error });
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// 6. Get All Discussions
app.get("/api/discussions", async (req, res) => {
  try {
    const discussions = await Discussion.find().sort({ date: -1 });
    res.json(discussions);
  } catch (error) {
    logger.error("Error fetching discussions", { error });
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// 7. Create a New Discussion
app.post("/api/discussions", async (req, res) => {
  const { title, content, category, tags, author } = req.body;

  try {
    const newDiscussion = new Discussion({
      title,
      content,
      category,
      tags,
      author,
    });
    await newDiscussion.save();
    res.status(201).json(newDiscussion);
  } catch (error) {
    logger.error("Error creating discussion", { error });
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});
// Assuming you have an Order model in your MongoDB for storing user orders
// Route to fetch orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from MongoDB
    res.status(200).json(orders);
  } catch (error) {
    logger.error("Error fetching orders", { error });
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Route to create a new order
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    logger.error("Error saving order", { error });
    res.status(500).json({ message: "Error saving order" });
  }
});


app.post("/api/predict", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  // Save uploaded file as a temporary image
  const filePath = path.join(__dirname, "temp.jpg");
  fs.writeFileSync(filePath, req.file.buffer);

  // Run Python script for prediction
  const pythonProcess = spawn("python", ["predict.py", filePath]);

  let result = "";
  let errorMessage = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorMessage += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      res.json({ prediction: result.trim() });
    } else {
      logger.error("Python script error", { error: errorMessage });
      res.status(500).json({ error: "Prediction failed", details: errorMessage });
    }
  });
});

app.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port} (${config.env})`);
});
