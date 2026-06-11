const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Checks drug-drug interactions using Claude AI.
 * Returns a structured result with severity, details, and recommendations.
 */
async function checkDrugInteractions(drugs) {
  // Edge case: single drug — no interaction possible
  if (!drugs || drugs.length < 2) {
    return {
      summary: "Only one medication prescribed. No drug interaction check required.",
      severity: "None",
      details: [],
      recommendations: ["Single medication — no interaction risk identified."],
    };
  }

  const drugList = drugs
    .map((d, i) => `${i + 1}. ${d.name} ${d.dosage}`)
    .join("\n");

  const prompt = `You are a clinical pharmacist AI assistant reviewing a prescription for potential drug-drug interactions before dispensing.

PRESCRIBED MEDICATIONS:
${drugList}

Please analyze these medications for any clinically significant drug interactions. Respond ONLY with a valid JSON object in the following exact format (no markdown, no explanation outside JSON):

{
  "summary": "One-sentence overall assessment",
  "severity": "None | Mild | Moderate | Severe",
  "details": [
    "Specific interaction description between Drug A and Drug B",
    "Another interaction if applicable"
  ],
  "recommendations": [
    "Actionable clinical recommendation for the pharmacist",
    "Another recommendation if applicable"
  ]
}

Severity guide:
- None: No known interactions
- Mild: Minor effects, monitor patient
- Moderate: May require dose adjustment or close monitoring
- Severe: Contraindicated or requires immediate physician consultation

Be specific to the actual drug names and dosages provided. This is for a licensed pharmacist's review before dispensing.`;

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = message.content[0].text.trim();

  // Strip markdown fences if present
  const cleaned = rawText.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  // Validate severity value
  const validSeverities = ["None", "Mild", "Moderate", "Severe"];
  if (!validSeverities.includes(parsed.severity)) {
    parsed.severity = "None";
  }

  return parsed;
}

module.exports = { checkDrugInteractions };
