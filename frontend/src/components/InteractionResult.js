import SeverityBadge from "./SeverityBadge";

const severityBg = {
  None: "bg-green-50 border-green-200",
  Mild: "bg-yellow-50 border-yellow-200",
  Moderate: "bg-orange-50 border-orange-200",
  Severe: "bg-red-50 border-red-200",
};

export default function InteractionResult({ result }) {
  if (!result) return null;

  const bgClass = severityBg[result.severity] || severityBg["None"];

  return (
    <div className={`rounded-[1.5rem] border-2 p-5 ${bgClass}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-800">AI Drug Interaction Analysis</h3>
        <SeverityBadge severity={result.severity} size="lg" />
      </div>

      <p className="mb-4 text-sm leading-6 text-slate-700">{result.summary}</p>

      {result.details && result.details.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Interactions Found</h4>
          <ul className="space-y-1.5">
            {result.details.map((detail, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="mt-0.5 flex-shrink-0 text-orange-500">⚠</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.recommendations && result.recommendations.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Pharmacist Recommendations</h4>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="mt-0.5 flex-shrink-0 text-blue-500">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
