"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPrescription } from "../../lib/api";
import InteractionResult from "../../components/InteractionResult";

const emptyDrug = { name: "", dosage: "" };
const createEmptyForm = () => ({
  patientName: "",
  doctorName: "",
  date: new Date().toISOString().split("T")[0],
  drugs: [{ ...emptyDrug }],
});

export default function NewPrescriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState(createEmptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [result, setResult] = useState(null);
  const [savedPrescriptionId, setSavedPrescriptionId] = useState(null);

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
    setNotice(null);
    setResult(null);
    setSavedPrescriptionId(null);

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
      setSavedPrescriptionId(response.data._id);
      setForm(createEmptyForm());
      if (response.aiFallback) {
        setNotice("AI service was unavailable, so the prescription was saved without an interaction check.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Screen 1</p>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Prescription Entry Form</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Enter the patient, doctor, and medications. The app sends the prescription to Claude for a pharmacy-specific interaction check, then saves both the record and the AI result in MongoDB.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              View prescriptions
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Patient name *</label>
              <input
                type="text"
                required
                value={form.patientName}
                onChange={(e) => updateField("patientName", e.target.value)}
                placeholder="e.g. Ravi Kumar"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              />
            </div>
            <div className="md:col-span-1">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Doctor name *</label>
              <input
                type="text"
                required
                value={form.doctorName}
                onChange={(e) => updateField("doctorName", e.target.value)}
                placeholder="e.g. Dr. Sharma"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              />
            </div>
            <div className="md:col-span-1">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Drug list *</label>
                <p className="mt-1 text-xs text-slate-500">Add multiple rows in the form Drug Name + Dosage, such as Metformin 500mg.</p>
              </div>
              <button
                type="button"
                onClick={addDrug}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                + Add row
              </button>
            </div>

            <div className="space-y-3">
              {form.drugs.map((drug, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3 md:grid-cols-[minmax(0,1fr)_180px_auto] md:items-end">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Drug name</label>
                    <input
                      type="text"
                      value={drug.name}
                      onChange={(e) => updateDrug(index, "name", e.target.value)}
                      placeholder="e.g. Metformin"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Dosage</label>
                    <input
                      type="text"
                      value={drug.dosage}
                      onChange={(e) => updateDrug(index, "dosage", e.target.value)}
                      placeholder="e.g. 500mg"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                    />
                  </div>
                  <div className="flex items-end md:justify-end">
                    {form.drugs.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeDrug(index)}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="px-4 py-3 text-xs text-slate-400">At least one medication row is required.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {form.drugs.length < 2 && (
              <p className="mt-2 text-xs text-slate-500">Single drug prescriptions skip the Claude interaction call and save a no-interaction result.</p>
            )}
          </div>

          {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">⚠ {error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Checking drug interactions with Claude AI..." : "Save prescription and check interactions"}
          </button>
        </form>
      </section>

      {result && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <InteractionResult result={result} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <p>
              Prescription saved to MongoDB{savedPrescriptionId ? ` (${savedPrescriptionId})` : ""}. {result.severity === "Severe" ? "Review immediately before dispensing." : "The interaction result is formatted and stored with the record."}
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              View list
            </button>
          </div>
        </section>
      )}

      {notice && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{notice}</div>}
    </div>
  );
}
