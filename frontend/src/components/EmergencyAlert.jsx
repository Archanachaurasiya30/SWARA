import { Link } from "react-router-dom";
import { Siren, Phone } from "lucide-react";

// Shown whenever a message sounds like immediate danger.
// It only offers links. Nothing is called, sent or shared until the person taps.
export default function EmergencyAlert({ compact = false, onNavigate }) {
  return (
    <div role="alert" className="rounded-2xl border-2 border-alert bg-red-50 p-4 text-alert-dark">
      <p className="flex items-center gap-2 font-display font-extrabold">
        <Siren size={20} aria-hidden="true" /> If you are in danger, call 112 now
      </p>
      {!compact && (
        <p className="mt-1 text-sm">
          Move to a crowded, well-lit place if you can. You can also open SOS to see your location and share it yourself.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href="tel:112"
          className="inline-flex items-center gap-2 rounded-xl bg-alert px-4 py-2.5 text-sm font-bold text-white transition hover:bg-alert-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alert focus-visible:ring-offset-2"
        >
          <Phone size={16} aria-hidden="true" /> Call 112
        </a>
        <Link
          to="/sos"
          onClick={onNavigate}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-alert bg-white px-4 py-2.5 text-sm font-bold text-alert transition hover:bg-alert hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alert focus-visible:ring-offset-2"
        >
          <Siren size={16} aria-hidden="true" /> Open SOS page
        </Link>
      </div>
    </div>
  );
}
