import { useState } from "react";
import { Link } from "react-router-dom";
import { Crosshair, CheckCircle2, Loader2 } from "lucide-react";
import { API_URL } from "../api";
import AiReportHelper from "../components/AiReportHelper";
import { reportCategories } from "../data/reportCategories";

const crimeTypes = reportCategories;

const emptyForm = { name: "", crimeType: "", location: "", description: "" };

const fieldClass =
  "w-full bg-white border border-line rounded-lg px-3 py-2.5 focus:border-berry";

export default function ReportCrime() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("This browser does not support location. Type the place manually.");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setForm((f) => ({
          ...f,
          location: `https://www.google.com/maps?q=${latitude},${longitude}`,
        }));

        setLocating(false);
      },
      () => {
        setError(
          "Could not get your location. Allow location access or type the place manually."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Could not submit the report.");
      }

      setStatus("success");
      setForm(emptyForm);
    } catch (err) {
      setStatus("idle");

      setError(
        err instanceof TypeError
          ? "Could not reach the server. Make sure the backend is running on port 5001."
          : err.message
      );
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto text-center bg-white border border-line rounded-xl p-8">
        <CheckCircle2
          size={48}
          className="mx-auto text-safe"
          aria-hidden="true"
        />

        <h1 className="mt-3 font-display font-extrabold text-2xl">
          Report submitted
        </h1>

        <p className="mt-2 text-muted">
          Your report has been saved. If you are in danger right now, call{" "}
          <a href="tel:112" className="font-bold text-alert underline">
            112
          </a>.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="bg-berry hover:bg-berry-dark text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            File another report
          </button>

          <Link
            to="/helplines"
            className="border border-ink/30 hover:bg-mist font-semibold px-5 py-2.5 rounded-lg"
          >
            View helplines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl">
        Report a crime
      </h1>

      <p className="mt-2 text-muted">
        Fill in what happened. Your name is optional. In immediate danger, call{" "}
        <a href="tel:112" className="font-bold text-alert underline">
          112
        </a>{" "}
        first.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div>
          <label htmlFor="name" className="block font-semibold mb-1">
            Your name <span className="font-normal text-muted">(optional)</span>
          </label>

          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={fieldClass}
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="crimeType" className="block font-semibold mb-1">
            Type of crime
          </label>

          <select
            id="crimeType"
            name="crimeType"
            value={form.crimeType}
            onChange={handleChange}
            required
            className={fieldClass}
          >
            <option value="">Select a type</option>

            {crimeTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block font-semibold mb-1">
            Where did it happen?
          </label>

          <div className="flex gap-2">
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Area, landmark or city"
              className={fieldClass}
            />

            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className="shrink-0 inline-flex items-center gap-2 border border-ink/30 hover:bg-white disabled:opacity-60 font-semibold px-3 rounded-lg"
            >
              {locating ? (
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              ) : (
                <Crosshair size={18} aria-hidden="true" />
              )}

              <span className="hidden sm:inline">Use my location</span>
              <span className="sr-only sm:hidden">Use my location</span>
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block font-semibold mb-1">
            What happened?
          </label>

          <textarea
            id="description"
            name="description"
            rows="5"
            minLength={10}
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Describe the incident in a few sentences."
            className={fieldClass}
          />
        </div>

        {/* AI Report Helper */}
        <AiReportHelper
          complaint={form.description}
          onApply={({ category, summary }) => {
            setForm((prev) => ({
              ...prev,
              crimeType: category,
              description: summary,
            }));
          }}
        />

        {error && (
          <p
            role="alert"
            className="bg-red-50 border border-red-200 text-alert-dark rounded-lg px-4 py-3"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 bg-berry hover:bg-berry-dark disabled:opacity-70 text-white font-bold px-5 py-3 rounded-lg"
        >
          {status === "submitting" && (
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          )}

          {status === "submitting" ? "Submitting" : "Submit report"}
        </button>
      </form>
    </div>
  );
}