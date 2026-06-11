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
      <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-20 text-center">
        <p className="text-sm font-medium text-red-700">{fetchError}</p>
        <Link href="/" className="mt-3 inline-block text-sm font-semibold text-slate-900 hover:underline">
          ← Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <Link href="/" className="font-semibold text-slate-900 hover:underline">
          ← Prescriptions
        </Link>
        <span>/</span>
        <span>{prescription.patientName}</span>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Prescription details</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{prescription.patientName}</h1>
            <p className="mt-2 text-sm text-slate-600">Prescribed by {prescription.doctorName}</p>
          </div>
          <SeverityBadge severity={prescription.interactionResult?.severity || "None"} size="lg" />
        </div>

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-3">
          <div>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Date</span>
            {new Date(prescription.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
          <div>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Medications</span>
            {prescription.drugs.length} drug{prescription.drugs.length !== 1 ? "s" : ""}
          </div>
          <div>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Recorded</span>
            {new Date(prescription.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Drug list</h2>
        <div className="mt-4 space-y-3">
          {prescription.drugs.map((drug, i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
              <span className="text-sm font-medium text-slate-900">{drug.name}</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">{drug.dosage}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">AI result</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The result below is the formatted AI interaction summary saved with the prescription record. It is not shown as raw JSON.
        </p>
        <div className="mt-4">
          {prescription.interactionResult ? (
            <InteractionResult result={prescription.interactionResult} />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
              No interaction result available for this prescription.
            </div>
          )}
        </div>
      </div>

      <Link href="/new" className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
        + New Prescription
      </Link>
    </div>
  );
}
