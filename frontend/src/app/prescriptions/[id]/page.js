import Link from "next/link";
import { fetchPrescription } from "../../../lib/api";
import SeverityBadge from "../../../components/SeverityBadge";
import InteractionResult from "../../../components/InteractionResult";

export default async function PrescriptionDetailPage({ params }) {
  let prescription = null;
  let fetchError = null;

  try {
    const data = await fetchPrescription(params.id);
    prescription = data.data;
  } catch (err) {
    fetchError = "Prescription not found or server unreachable.";
  }

  if (fetchError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-sm">{fetchError}</p>
        <Link href="/" className="text-blue-600 text-sm hover:underline mt-3 inline-block">← Back to list</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">← Prescriptions</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 text-sm font-medium">{prescription.patientName}</span>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{prescription.patientName}</h1>
            <p className="text-slate-500 text-sm mt-0.5">Prescribed by {prescription.doctorName}</p>
          </div>
          <SeverityBadge severity={prescription.interactionResult?.severity || "None"} size="lg" />
        </div>

        <div className="flex gap-6 text-sm text-slate-500 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Date</span>
            {new Date(prescription.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Medications</span>
            {prescription.drugs.length} drug{prescription.drugs.length !== 1 ? "s" : ""}
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Recorded</span>
            {new Date(prescription.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* Drug list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Prescribed Medications</h2>
        <div className="space-y-2">
          {prescription.drugs.map((drug, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-slate-800">{drug.name}</span>
              <span className="text-sm text-slate-500 bg-white border border-slate-200 rounded-md px-2.5 py-1">{drug.dosage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI interaction result */}
      {prescription.interactionResult && (
        <InteractionResult result={prescription.interactionResult} />
      )}

      <div className="mt-5 flex gap-3">
        <Link href="/" className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors text-center">
          ← Back to List
        </Link>
        <Link href="/new" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors text-center">
          + New Prescription
        </Link>
      </div>
    </div>
  );
}
