const mongoose = require("mongoose");

const DrugSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dosage: { type: String, required: true, trim: true },
});

const InteractionResultSchema = new mongoose.Schema({
  summary: { type: String, required: true },
  severity: {
    type: String,
    enum: ["None", "Mild", "Moderate", "Severe"],
    default: "None",
  },
  details: [{ type: String }],
  recommendations: [{ type: String }],
  checkedAt: { type: Date, default: Date.now },
});

const PrescriptionSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    doctorName: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    drugs: { type: [DrugSchema], required: true },
    // Cache key: sorted drug names joined — avoids re-calling Claude for same combo
    drugCacheKey: { type: String, index: true },
    interactionResult: { type: InteractionResultSchema, default: null },
  },
  { timestamps: true }
);

function buildDrugCacheKey(drugs = []) {
  return drugs
    .map((drug) => `${drug.name.toLowerCase().trim()}::${drug.dosage.toLowerCase().trim()}`)
    .sort()
    .join("|");
}

PrescriptionSchema.pre("save", function (next) {
  if (this.drugs && this.drugs.length > 0) {
    this.drugCacheKey = buildDrugCacheKey(this.drugs);
  }
  next();
});

PrescriptionSchema.statics.buildDrugCacheKey = buildDrugCacheKey;

module.exports = mongoose.model("Prescription", PrescriptionSchema);
