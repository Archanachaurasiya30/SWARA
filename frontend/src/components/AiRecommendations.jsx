import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Footprints,
  Bus,
  Home,
  Laptop,
  Briefcase,
  Siren,
  CheckCircle2,
  Info,
  AlertTriangle,
} from "lucide-react";
import EmergencyAlert from "./EmergencyAlert";
import { getRecommendations } from "../utils/aiApi";
import { focusRing } from "../utils/ui";

const scenarios = [
  { id: "travelling-alone", label: "Travelling Alone", icon: Footprints },
  { id: "public-transport", label: "Public Transport", icon: Bus },
  { id: "home-safety", label: "Home Safety", icon: Home },
  { id: "online-safety", label: "Online Safety", icon: Laptop },
  { id: "workplace-safety", label: "Workplace Safety", icon: Briefcase },
  { id: "emergency", label: "Emergency Situation", icon: Siren },
];

const languages = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिन्दी" },
  { id: "hinglish", label: "Hinglish" },
];

// Only the chosen topic and language are sent to the AI. No personal details are involved.
export default function AiRecommendations() {
  const [scenario, setScenario] = useState("travelling-alone");
  const [language, setLanguage] = useState("en");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [shownFor, setShownFor] = useState(null); // which topic the result belongs to

  const handleGet = async () => {
    setStatus("loading");
    setError("");
    try {
      const data = await getRecommendations(scenario, language);
      setResult(data);
      setShownFor(scenario);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const shownLabel = scenarios.find((s) => s.id === shownFor)?.label;

  return (
    <section aria-labelledby="ai-recs-heading" className="mt-14">
      <div className="rounded-3xl border border-line bg-white p-6 shadow-sm shadow-berry/5 sm:p-8">
        <h2 id="ai-recs-heading" className="flex items-center gap-3 font-display text-xl font-bold text-ink sm:text-2xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-berry to-rose text-white shadow-lg shadow-berry/20">
            <Sparkles size={22} aria-hidden="true" />
          </span>
          AI safety recommendations
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Choose a situation to get practical suggestions in English, Hindi or Hinglish. Only the topic and language you
          pick are sent to the AI. Nothing personal is shared.
        </p>

        {/* Situation choice */}
        <fieldset className="mt-6">
          <legend className="text-sm font-semibold text-ink">Your situation</legend>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
            {scenarios.map(({ id, label, icon: Icon }) => {
              const active = scenario === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setScenario(id)}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${focusRing} ${
                    active
                      ? "border-berry bg-lavender text-berry"
                      : "border-line bg-white text-ink hover:border-berry/40 hover:bg-mist"
                  }`}
                >
                  <Icon size={20} aria-hidden="true" className={id === "emergency" ? "text-alert" : ""} />
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Language choice */}
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-ink">Language</legend>
          <div className="mt-3 inline-flex rounded-xl border border-line bg-mist p-1">
            {languages.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={language === id}
                onClick={() => setLanguage(id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${focusRing} ${
                  language === id ? "bg-white text-berry shadow-sm" : "text-muted hover:text-berry"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        {scenario === "emergency" && (
          <div className="mt-5">
            <EmergencyAlert />
          </div>
        )}

        <button
          type="button"
          onClick={handleGet}
          disabled={status === "loading"}
          className={`mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-berry to-violet-600 px-6 py-3 font-bold text-white shadow-md shadow-berry/25 transition motion-safe:hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 ${focusRing}`}
        >
          {status === "loading" ? (
            <Loader2 size={18} className="motion-safe:animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles size={18} aria-hidden="true" />
          )}
          {status === "loading" ? "Preparing suggestions..." : "Get recommendations"}
        </button>

        <div aria-live="polite">
          {status === "error" && (
            <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-alert-dark">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{error} The ready-made safety tips on this page are still available.</span>
            </p>
          )}

          {status === "done" && result && (
            <div className="mt-6">
              <p className="font-display text-lg font-bold text-ink">{shownLabel}</p>
              {result.summary && <p className="mt-1 text-muted">{result.summary}</p>}

              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {result.recommendations.map((r) => (
                  <li key={r.title} className="flex gap-3 rounded-2xl border border-line bg-mist p-4">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-safe" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-ink">{r.title}</p>
                      <p className="mt-0.5 text-sm text-muted">{r.advice}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {result.emergencyNote && (
                <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-alert-dark">
                  {result.emergencyNote}
                </p>
              )}

              <p className="mt-4 flex items-start gap-2 text-xs text-muted">
                <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                AI-generated general suggestions. No place, route or situation can be guaranteed safe. If you feel in
                danger, call 112.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
