import { useState } from "react";
import { Sparkles, Loader2, Check, Info, Tag, AlertTriangle } from "lucide-react";
import EmergencyAlert from "./EmergencyAlert";
import { categorizeReport } from "../utils/aiApi";
import { detectEmergency } from "../utils/emergency";
import { reportCategories, urgencyStyles } from "../data/reportCategories";
import { focusRing } from "../utils/ui";

const fieldClass = `w-full rounded-xl border border-line bg-white px-4 py-3 text-ink focus:border-berry ${focusRing}`;

// AI suggestions for a complaint: category, short summary, keywords and urgency.
//
// How to use it on the Report a Crime page:
//   <AiReportHelper complaint={description} onApply={({ category, summary }) => { ...fill your form... }} />
// "complaint" is the text the user typed. "onApply" is optional and is called only when
// the user taps "Use these in my report". This component never submits the report.
export default function AiReportHelper({ complaint = "", onApply }) {
  const [agreed, setAgreed] = useState(false); // consent for this visit only, never saved
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  // The user can change these two before using them
  const [category, setCategory] = useState("Other");
  const [summary, setSummary] = useState("");
  const [applied, setApplied] = useState(false);

  // Checked on this device only (no AI), so the warning appears immediately
  const looksUrgent = detectEmergency(complaint);
  const tooShort = complaint.trim().length < 20;

  const handleSuggest = async () => {
    setStatus("loading");
    setError("");
    setApplied(false);
    try {
      const data = await categorizeReport(complaint.trim());
      setResult(data);
      setCategory(data.category);
      setSummary(data.summary);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleApply = () => {
    onApply?.({ category, summary });
    setApplied(true);
  };

  const showEmergency = looksUrgent || result?.immediateDanger;

  return (
    <section aria-labelledby="ai-report-heading" className="rounded-3xl border border-berry/20 bg-lavender/40 p-5 sm:p-6">
      <h2 id="ai-report-heading" className="flex items-center gap-3 font-display text-lg font-bold text-ink">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-berry to-violet-500 text-white">
          <Sparkles size={20} aria-hidden="true" />
        </span>
        AI suggestions for your report (optional)
      </h2>
      <p className="mt-2 text-sm text-muted">
        AI can suggest a category, a short summary, keywords and an urgency level. You stay in control:
        review and edit everything. Nothing is submitted automatically.
      </p>

      {showEmergency && (
        <div className="mt-4">
          <EmergencyAlert />
        </div>
      )}

      {/* Consent */}
      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white p-4 text-sm text-ink">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className={`mt-0.5 h-5 w-5 shrink-0 accent-berry ${focusRing}`}
        />
        <span>
          I agree to send the complaint text I wrote to Google Gemini (an external AI service) to get suggestions.
          <span className="mt-1 block text-xs text-muted">
            Avoid including exact addresses or phone numbers. If you do not agree, simply skip this and fill the form yourself.
          </span>
        </span>
      </label>

      <button
        type="button"
        onClick={handleSuggest}
        disabled={!agreed || tooShort || status === "loading"}
        className={`mt-4 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-berry to-violet-600 px-5 py-3 font-bold text-white shadow-md shadow-berry/25 transition hover:shadow-lg disabled:opacity-50 ${focusRing}`}
      >
        {status === "loading" ? (
          <Loader2 size={18} className="motion-safe:animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles size={18} aria-hidden="true" />
        )}
        {status === "loading" ? "Thinking..." : "Get AI suggestions"}
      </button>
      {tooShort && (
        <p className="mt-2 text-xs text-muted">Write at least a couple of sentences about what happened to enable this.</p>
      )}

      {status === "error" && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-alert-dark">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error} You can still fill in and submit your report without AI.</span>
        </p>
      )}

      {/* Result */}
      <div aria-live="polite">
        {status === "done" && result && (
          <div className="mt-5 space-y-4 rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-ink">Suggested urgency:</span>
              <span className={`rounded-full border px-3 py-1 text-sm font-bold ${urgencyStyles[result.urgency]}`}>
                {result.urgency}
              </span>
            </div>

            <div>
              <label htmlFor="ai-category" className="mb-1.5 block text-sm font-semibold text-ink">
                Suggested category (you can change it)
              </label>
              <select id="ai-category" value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass}>
                {reportCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ai-summary" className="mb-1.5 block text-sm font-semibold text-ink">
                Short summary (you can edit it)
              </label>
              <textarea
                id="ai-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                maxLength={600}
                className={fieldClass}
              />
            </div>

            {result.keywords.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <Tag size={16} className="text-berry" aria-hidden="true" /> Important keywords
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {result.keywords.map((k) => (
                    <li key={k} className="rounded-full bg-lavender px-3 py-1 text-sm font-medium text-berry">
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {onApply && (
              <div>
                <button
                  type="button"
                  onClick={handleApply}
                  className={`inline-flex items-center gap-2 rounded-xl border-2 border-berry px-5 py-2.5 font-bold text-berry transition hover:bg-berry hover:text-white ${focusRing}`}
                >
                  <Check size={18} aria-hidden="true" /> Use these in my report
                </button>
                {applied && (
                  <p role="status" className="mt-2 text-sm text-safe">
                    Added to your report form. Please review it, then submit when you are ready.
                  </p>
                )}
              </div>
            )}

            <p className="flex items-start gap-2 rounded-xl bg-mist p-3 text-xs text-muted">
              <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              These are AI-generated suggestions, not an official legal classification. SWARA AI does not decide
              whether a complaint is genuine. Please check that everything is correct before you submit.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
