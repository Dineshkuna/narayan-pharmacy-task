"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPrescription } from "../../lib/api";
import InteractionResult from "../../components/InteractionResult";

const emptyDrug = { name: "", dosage: "" };

export default function NewPrescriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    patientName: "",
    doctorName: "",
    date: new Date().toISOString().split("T")[0],
    drugs: [{ ...emptyDrug }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateDrug = (index, field, value) => {
    setForm((prev) => {
      const drugs = [...prev.drugs];
      drugs[index] = { ...drugs[index], [field]: value };
      return { ...prev, drugs };
    });
  };

  const addDrug = () => {
    setForm((prev) => ({ ...prev, drugs: [...prev.drugs, { ...emptyDrug }] }));
  };

  const removeDrug = (index) => {
    setForm((prev) => ({
      ...prev,
      drugs: prev.drugs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validate drugs
    const validDrugs = form.drugs.filter((d) => d.name.trim() && d.dosage.trim());
    if (validDrugs.length === 0) {
      setError("Please add at least one drug with name and dosage.");
      return;
    }

    setLoading(true);
    try {
      const response = await createPrescription({ ...form, drugs: validDrugs });
      setResult(response.data.interactionResult);

      // Redirect to list after 3 seconds if no severe interaction
      if (response.data.interactionResult?.severity !== "Severe") {
        setTimeout(() => router.push("/"), 3000);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">New Prescription</h1>
        <p className="text-slate-500 text-sm mt-1">Enter prescription details. Claude AI will check for drug interactions on submit.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient & Doctor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Patient Name *</label>
              <input
                type="text"
                required
                value={form.patientName}
                onChange={(e) => updateField("patientName", e.target.value)}
                placeholder="e.g. Ravi Kumar"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Doctor Name *</label>
              <input
                type="text"
                required
                value={form.doctorName}
                onChange={(e) => updateField("doctorName", e.target.value)}
                placeholder="e.g. Dr. Sharma"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Prescription Date *</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Drug List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-700">
                Medications * <span className="text-slate-400 font-normal">({form.drugs.length} added)</span>
              </label>
              <button
                type="button"
                onClick={addDrug}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                + Add Drug
              </button>
            </div>

            <div className="space-y-3">
              {form.drugs.map((drug, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={drug.name}
                      onChange={(e) => updateDrug(index, "name", e.target.value)}
                      placeholder="Drug name (e.g. Metformin)"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="w-36">
                    <input
                      type="text"
                      value={drug.dosage}
                      onChange={(e) => updateDrug(index, "dosage", e.target.value)}
                      placeholder="Dosage (e.g. 500mg)"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {form.drugs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDrug(index)}
                      className="text-slate-400 hover:text-red-500 mt-2.5 flex-shrink-0 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {form.drugs.length < 2 && (
              <p className="text-xs text-slate-400 mt-2">
                💡 Add 2+ drugs to trigger the AI interaction check
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              ⚠ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Checking drug interactions with Claude AI...
              </>
            ) : (
              "Submit & Check Interactions"
            )}
          </button>
        </form>
      </div>

      {/* AI Result */}
      {result && (
        <div className="mt-6">
          <InteractionResult result={result} />
          <p className="text-xs text-slate-400 text-center mt-3">
            Prescription saved. {result.severity !== "Severe" ? "Redirecting to list..." : "Please review the severe interaction before dispensing."}
          </p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => router.push("/")}
              className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              View All Prescriptions
            </button>
            <button
              onClick={() => { setResult(null); setForm({ patientName: "", doctorName: "", date: new Date().toISOString().split("T")[0], drugs: [{ ...emptyDrug }] }); }}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              New Prescription
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
