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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Prescriptions</h1>
          <p className="text-slate-500 text-sm mt-1">
            {prescriptions.length > 0
              ? `${prescriptions.length} prescription${prescriptions.length !== 1 ? "s" : ""} on record`
              : "No prescriptions yet"}
          </p>
        </div>
        <Link
          href="/new"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          + New Prescription
        </Link>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 mb-6">
          ⚠ {fetchError}
        </div>
      )}

      {!fetchError && prescriptions.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="text-5xl mb-4">💊</div>
          <p className="text-slate-500 text-sm">No prescriptions yet. Create your first one!</p>
          <Link href="/new" className="inline-block mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            + New Prescription
          </Link>
        </div>
      )}

      {prescriptions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Patient</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Doctor</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Date</th>
                <th className="text-center px-5 py-3.5 font-semibold text-slate-600">Drugs</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Interaction</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions.map((rx) => (
                <tr key={rx._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-800">{rx.patientName}</td>
                  <td className="px-5 py-4 text-slate-600">{rx.doctorName}</td>
                  <td className="px-5 py-4 text-slate-500">
                    {new Date(rx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="bg-blue-100 text-blue-700 rounded-full px-2.5 py-1 text-xs font-semibold">
                      {rx.drugCount}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <SeverityBadge severity={rx.severity} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/prescriptions/${rx._id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
