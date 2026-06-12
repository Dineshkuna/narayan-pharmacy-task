require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns").promises;
const { URL } = require("url");

const prescriptionRoutes = require("./routes/prescriptions");

const app = express();
const primaryMongoUri = process.env.MONGODB_URI;

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

async function normalizeMongoUri(uri) {
  if (!uri || !uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  const parsed = new URL(uri);
  const serviceName = parsed.hostname;
  const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${serviceName}`);
  const hosts = srvRecords.map((record) => `${record.name}:${record.port}`).join(",");

  const query = new URLSearchParams(parsed.search);

  try {
    const txtRecords = await dns.resolveTxt(`_mongodb._tcp.${serviceName}`);
    const txtString = txtRecords.flat().join("");
    if (txtString) {
      const txtParams = new URLSearchParams(txtString);
      for (const [key, value] of txtParams.entries()) {
        if (!query.has(key)) {
          query.set(key, value);
        }
      }
    }
  } catch (err) {
    // TXT records are optional; continue with the direct seed list if they are unavailable.
  }

  if (!query.has("tls") && !query.has("ssl")) {
    query.set("tls", "true");
  }

  if (!query.has("authSource")) {
    query.set("authSource", "admin");
  }

  const username = parsed.username ? encodeURIComponent(decodeURIComponent(parsed.username)) : "";
  const password = parsed.password ? encodeURIComponent(decodeURIComponent(parsed.password)) : "";
  const authPart = username ? `${username}:${password}@` : "";
  const pathPart = parsed.pathname && parsed.pathname !== "/" ? parsed.pathname : "/";

  return `mongodb://${authPart}${hosts}${pathPart}?${query.toString()}`;
}

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
    if (!primaryMongoUri) {
      throw new Error("Missing MONGODB_URI");
    }

    const normalizedMongoUri = await normalizeMongoUri(primaryMongoUri);
    await mongoose.connect(normalizedMongoUri);
    console.log("✅ Connected to MongoDB");
  } catch (primaryErr) {
    console.error("❌ Primary MongoDB connection failed:", primaryErr.message);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
