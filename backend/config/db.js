const mongoose = require("mongoose");
const dns = require("dns");

function configureDnsForAtlas(uri) {
  if (typeof uri === "string" && uri.startsWith("mongodb+srv://")) {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }
}

async function connectMongoDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI in environment variables");
  }

  configureDnsForAtlas(mongoUri);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  return mongoose.connection;
}

module.exports = { connectMongoDatabase };