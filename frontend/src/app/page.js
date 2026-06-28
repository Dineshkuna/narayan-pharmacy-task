import Link from "next/link";
import { fetchPrescriptions } from "../lib/api";
import SeverityBadge from "../components/SeverityBadge";

export default async function PrescriptionsPage() {
  let prescriptions = [];
  let fetchError = null;

  try {
    const data = await fetchPrescriptions();
    prescriptions = data.data || [];
  } catch (err) {
    fetchError = "Could not connect to the backend. Make sure the server is running on port 5000.";
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Screen 2</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Prescriptions List</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Access a complete history of saved prescriptions along with patient details, prescription date, prescribed medications, and AI-generated analysis. Click on any record to review drug interactions, severity levels, potential risks, clinical recommendations, and the full evaluation report.
            </p>
          </div>
          <Link
            href="/new"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            + New Prescription
          </Link>
        </div>
      </section>

      {fetchError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">⚠ {fetchError}</div>
      )}

      {!fetchError && prescriptions.length === 0 && (
        <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">No prescriptions yet.</p>
          <p className="mt-2 text-slate-700">Create the first prescription to start checking interactions.</p>
          <Link href="/new" className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
            + New Prescription
          </Link>
        </div>
      )}

      {prescriptions.length > 0 && (
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-500">
                  <th className="px-5 py-4 text-left font-semibold uppercase tracking-[0.18em]">Patient</th>
                  <th className="px-5 py-4 text-left font-semibold uppercase tracking-[0.18em]">Date</th>
                  <th className="px-5 py-4 text-left font-semibold uppercase tracking-[0.18em]">Drug Count</th>
                  <th className="px-5 py-4 text-left font-semibold uppercase tracking-[0.18em]">Severity</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prescriptions.map((rx) => (
                  <tr key={rx._id} className="group transition-colors hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{rx.patientName}</div>
                      <div className="mt-1 text-xs text-slate-500">Click to view the full prescription details</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {new Date(rx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                        {rx.drugCount} drug{rx.drugCount !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <SeverityBadge severity={rx.severity} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/prescriptions/${rx._id}`} className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-slate-600">
                        View details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
