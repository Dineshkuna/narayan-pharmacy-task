const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");
const { checkDrugInteractions } = require("../services/claudeService");

// GET /api/prescriptions — list all prescriptions
router.get("/", async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .select("patientName doctorName date drugs interactionResult createdAt")
      .sort({ createdAt: -1 });

    const formatted = prescriptions.map((p) => ({
      _id: p._id,
      patientName: p.patientName,
      doctorName: p.doctorName,
      date: p.date,
      drugCount: p.drugs.length,
      severity: p.interactionResult?.severity || "None",
      createdAt: p.createdAt,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error("List prescriptions error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch prescriptions" });
  }
});

// GET /api/prescriptions/:id — get single prescription detail
router.get("/:id", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ success: false, error: "Prescription not found" });
    }
    res.json({ success: true, data: prescription });
  } catch (err) {
    console.error("Get prescription error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch prescription" });
  }
});

// POST /api/prescriptions — create new prescription + check interactions
router.post("/", async (req, res) => {
  try {
    const { patientName, doctorName, date, drugs } = req.body;

    // Basic validation
    if (!patientName || !doctorName || !date || !drugs || drugs.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Patient name, doctor name, date, and at least one drug are required.",
      });
    }

    // Generate cache key for this drug combination
    const cacheKey = drugs
      .map((d) => d.name.toLowerCase().trim())
      .sort()
      .join("|");

    // Check DB cache — if same drug combo was already checked, reuse result
    let interactionResult = null;
    const cached = await Prescription.findOne({
      drugCacheKey: cacheKey,
      interactionResult: { $ne: null },
    }).select("interactionResult");

    if (cached) {
      interactionResult = cached.interactionResult;
      console.log("✅ Cache hit — reusing interaction result for:", cacheKey);
    } else {
      // Call Claude API
      console.log("🤖 Calling Claude for drug interaction check...");
      interactionResult = await checkDrugInteractions(drugs);
    }

    // Save prescription to DB
    const prescription = new Prescription({
      patientName,
      doctorName,
      date: new Date(date),
      drugs,
      interactionResult,
    });

    await prescription.save();

    res.status(201).json({
      success: true,
      data: prescription,
      cached: !!cached,
    });
  } catch (err) {
    console.error("Create prescription error:", err);

    // Handle Claude API errors gracefully
    if (err.name === "APIError" || err.status) {
      return res.status(502).json({
        success: false,
        error: "AI service temporarily unavailable. Prescription saved without interaction check.",
      });
    }

    if (err.name === "SyntaxError") {
      return res.status(500).json({
        success: false,
        error: "Failed to parse AI response. Please try again.",
      });
    }

    res.status(500).json({ success: false, error: "Failed to create prescription" });
  }
});

module.exports = router;
