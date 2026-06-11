require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const prescriptionRoutes = require("./routes/prescriptions");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/prescriptions", prescriptionRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Pharmacy API running" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pharmacy")
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
