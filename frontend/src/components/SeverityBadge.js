const severityConfig = {
  None: { label: "No Interaction", bg: "bg-green-100", text: "text-green-800", border: "border-green-200", dot: "bg-green-500" },
  Mild: { label: "Mild", bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200", dot: "bg-yellow-500" },
  Moderate: { label: "Moderate", bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200", dot: "bg-orange-500" },
  Severe: { label: "Severe", bg: "bg-red-100", text: "text-red-800", border: "border-red-200", dot: "bg-red-500" },
};

export default function SeverityBadge({ severity = "None", size = "sm" }) {
  const config = severityConfig[severity] || severityConfig["None"];
  const padding = size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${config.bg} ${config.text} ${config.border} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
