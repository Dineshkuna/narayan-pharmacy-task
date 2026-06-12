require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const { connectMongoDatabase } = require("./config/db");

const prescriptionRoutes = require("./routes/prescriptions");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/prescriptions", prescriptionRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Pharmacy API running" });
});

async function startServer() {
  try {
    await connectMongoDatabase();
    console.log("✅ Connected to MongoDB");
  } catch (primaryErr) {
    console.error("Mongo Error:", primaryErr.message || primaryErr);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
