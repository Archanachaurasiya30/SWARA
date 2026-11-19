import { Phone } from "lucide-react";
import { focusRing } from "../utils/ui";

// One helpline number card with a click-to-call button.
// Used on the Home page and the Helplines page, so edit the look here only once.
export default function HelplineCard({ h }) {
  const featured = Boolean(h.featured);
  return (
    <div
      className={`flex flex-col rounded-3xl border p-6 transition duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl ${
        featured
          ? "border-transparent bg-linear-to-br from-alert to-rose text-white shadow-lg shadow-alert/25 hover:shadow-alert/40"
          : "border-line bg-white shadow-sm shadow-berry/5 hover:border-berry/40 hover:shadow-berry/15"
      }`}
    >
      <p className={`font-display text-4xl font-extrabold ${featured ? "text-white" : "text-berry"}`}>
        {h.number}
      </p>
      <p className="mt-1 font-bold">{h.name}</p>
      <p className={`mt-1 flex-1 text-sm ${featured ? "text-white/90" : "text-muted"}`}>{h.note}</p>
      <a
        href={`tel:${h.number}`}
        aria-label={`Call ${h.name} on ${h.number}`}
        className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold transition ${
          featured
            ? "bg-white text-alert hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-alert"
            : `bg-berry text-white hover:bg-berry-dark ${focusRing}`
        }`}
      >
        <Phone size={18} aria-hidden="true" /> Call {h.number}
      </a>
    </div>
  );
}
